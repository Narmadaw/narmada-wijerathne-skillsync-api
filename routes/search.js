// const express = require("express");
// const router = express.Router();
// const unirest = require("unirest");
// const cheerio = require("cheerio");
// const natural = require("natural");

// let jobsData = [];

// let jobDescription = [];


// const getData = async () => {
//   try {
//     let range = Math.ceil(415 / 25);
//     let pageNum = 0;

//     for (let i = 0; i < range; i++) {
//       let url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=React&location=vancouver&trk=public_jobs_jobs-search-bar_search-submit&start=${pageNum}`;
//       pageNum += 25;
//       let response = await unirest.get(url).headers({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36" });
//       const $ = cheerio.load(response.body);

//       let scrapedJobsData = [];
//       $(".job-search-card").each((i, el) => {
//         scrapedJobsData.push({
//           title: $(el).find(".base-search-card__title").text()?.trim(),
//           company: $(el).find("h4.base-search-card__subtitle").text()?.trim(),
//           // link: $(el).find("a.base-card__full-link").attr("href")?.trim(),
//           id: $(el).attr("data-entity-urn")?.split("urn:li:jobPosting:")[1],
//           location: $(el).find(".job-search-card__location").text()?.trim(),
//           date: $(el).find(".job-search-card__listdate").text()?.trim(),
//         });
//       });
//       jobsData = [...jobsData, ...scrapedJobsData];
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };





// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   getJobDetails(id)
//     .then(selectedJob => {
//       res.send(ulContents);
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });
// let ulContents = [];
// const getJobDetails = async (jobID) => {
  
//   try {
//     let url2 = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobID}`;
//     let response2 = await unirest.get(url2).headers({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"});
//     const $2 = cheerio.load(response2.body);
//     const targetDiv = $2('.description__text.description__text--rich');
//     const ulElements = targetDiv.find('ul');
    
//     // Initialize an array to store ul content
//     //const ulContents = [];
//     ulElements.each((ulIndex, ul) => {
//         let ulContent = `UL ${ulIndex + 1} Content:\n`;
    
//         $2(ul).find('li').each((liIndex, li) => {
//             ulContent += `  - ${$2(li).text().trim()}\n`;
//         });
//         ulContents.push(ulContent);
        
//     });
//     console.log(ulContents);
//     return ulContents;
    
    
//   } catch (e) {
//     console.log(e);
//     return '';
//   }
// };

// // const resumeData = `
// //     Provided training for 6 junior developers and engineers and successfully developed more than 50% of the reports with the reporting function of the system which optimized efficiency and productivity.
// //     Successfully developed the entire UI aspect of the system, exceeding client expectations and earning strong client satisfaction for completing the project in a timely and efficient manner.
// //     Design, code, test, and debug software applications and systems. This involves writing code in various programming languages and using development tools and frameworks.
// //     Successfully developed key aspects of ERP system, facilitating checklists for companies to streamline task management for clients and meet all demands and expectations according to client preferences.
// // `;

// // const resumeSkills = ['Node.js', 'JavaScript', 'React.js', 'Express.js', 'HTML/CSS', 'Version Control (GIT)', 'Responsive Design'];

// // const calculateSimilarity = (jobDescription, resumeSkills) => {
// //   const jobDescriptionTokens = natural.WordTokenizer().tokenize(jobDescription);
// //   const jaccardSimilarity = natural.JaccardIndex(jobDescriptionTokens, resumeSkills);
// //   return jaccardSimilarity;
// // };

// // const matchResumeWithJobs = async () => {
// //   try {
// //     const results = [];

// //     for (const job of jobsData) {
// //       const jobDetails = await getJobDetails(job.id);
// //       const similarity = calculateSimilarity(jobDetails, resumeSkills);
// //       results.push({
// //         company: job.company,
// //         title: job.title,
// //         location: job.location,
// //         date: job.date,
// //         similarity: similarity
// //       });
// //     }

// //     // Now you have an array 'results' with company, title, location, date, and similarity for each job
// //     console.log(results);
// //     return results;
// //   } catch (e) {
// //     console.log(e);
// //     console.error('Error loading HTML with Cheerio:', e);
// //     return [];
// //   }
// // };

// router.get("/", async (req, res) => {
//   //const results = await matchResumeWithJobs();
//   // res.json({ jobs: results });
//   res.json({ jobs: jobsData });
// });



// module.exports = router;
