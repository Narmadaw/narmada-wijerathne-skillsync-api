const express = require("express");
const unirest = require("unirest");
const cheerio = require("cheerio");
const natural = require("natural");
const fs = require("fs");

//get job list
const getJobList = async (req, res) =>{
    let jobsData = [];
    const title = req.query.title;
    const location = req.query.location;
    console.log(title);
    console.log(location);

    try {
        let range = Math.ceil(415 / 25);
        let pageNum = 0;
    
        for (let i = 0; i < range; i++) {
          let url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${title}&location=${location}&trk=public_jobs_jobs-search-bar_search-submit&start=${pageNum}`;
          pageNum += 25;
          let response = await unirest.get(url).headers({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36" });
          const $ = cheerio.load(response.body);
    
          let scrapedJobsData = [];
          $(".job-search-card").each((i, el) => {
            scrapedJobsData.push({
              title: $(el).find(".base-search-card__title").text()?.trim(),
              company: $(el).find("h4.base-search-card__subtitle").text()?.trim(),
              link: $(el).find("a.base-card__full-link").attr("href")?.trim(),
              id: $(el).attr("data-entity-urn")?.split("urn:li:jobPosting:")[1],
              location: $(el).find(".job-search-card__location").text()?.trim(),
              date: $(el).find(".job-search-card__listdate").text()?.trim(),
            });
          });
          jobsData = [...jobsData, ...scrapedJobsData];
        }
        res.json(jobsData); 
      } 
      catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error', e });
      }
}

//get job by Id
const getJobDetailsById = async (req, res) => {
  const {id} = req.params;
  try {
    let url2 = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${id}`;
    let response2 = await unirest.get(url2).headers({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"});
    const $2 = cheerio.load(response2.body);
    const targetDiv = $2('.description__text.description__text--rich');
    const ulElements = targetDiv.find('ul');
    
    const ulContents = [];
    ulElements.each((ulIndex, ul) => {
        let ulContent = `\n`;
        $2(ul).find('li').each((liIndex, li) => {
            ulContent += `- ${$2(li).text().trim()}\n`;
        });
        ulContents.push(ulContent);
    });
    resumeScanner(ulContents, res);
  } catch (e) {
    console.log(e);
    return '';
  }
};

const resumeScanner = (jobDescription, res) =>{
const jobDescriptionText = jobDescription.join(' ');

// read the resume from the JSON file
const resumeFileContent = fs.readFileSync('./data/resume.json');
const resumeData = JSON.parse(resumeFileContent);
const myResumeText = resumeData.resume.join('');

// read the skills from the JSON file
const skillsFileContent = fs.readFileSync('./data/skills.json');
const skillsData = JSON.parse(skillsFileContent);
const skills = skillsData.skills;

// convert texts to lowercase and tokenize
const tokenizer = new natural.WordTokenizer();
const resumeTokens = new Set(tokenizer.tokenize(myResumeText.toLowerCase()));
const jobDescriptionTokens = new Set(tokenizer.tokenize(jobDescriptionText.toLowerCase()));

// filter the tokens to only include the skills
const resumeSkills = [...resumeTokens].filter(token => skills.includes(token));
const jobDescriptionSkills = [...jobDescriptionTokens].filter(token => skills.includes(token));

// calculate the Jaccard Similarity to get the matching percentage
const intersection = new Set(resumeSkills.filter(skill => jobDescriptionSkills.includes(skill)));
const union = new Set([...resumeSkills, ...jobDescriptionSkills]);

const jaccardSimilarity = intersection.size / union.size;
const matchingPercentage = jaccardSimilarity * 100;

// sending the response back to the client
res.json({
  resumeSkills: resumeSkills,
  jobDescriptionSkills: jobDescriptionSkills,
  matchingPercentage: matchingPercentage.toFixed(2),
  jobDescription: jobDescription
});
}

const postResume = (req, res) =>{
  const resume = req.body.resume;
  fs.writeFileSync('./data/resume.json', JSON.stringify({ resume }));
  res.json({ message: 'Skills saved successfully' });
};


module.exports = {
    getJobList,
    getJobDetailsById,
    postResume,
}