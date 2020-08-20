require('dotenv').config();

//Discord dependencies
const Discord = require('discord.js')
const client = new Discord.Client()

//GitHub dependencies
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});




client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === '-list repos') {
    repos().then(data=>{
      msg.reply(data);
    })

  }
  if (msg.content === '-list pr') {
    allPR().then(data=>{
      msg.reply(data);
    })
  }

  if(msg.content === '-list openpr'){
    openPR().then(data=>{
      msg.reply(data);
    })
  }

  if(msg.content === '-list closedpr'){
    closedPR().then(data=>{
      msg.reply(data);
    })
  }
})

client.login(process.env.DISCORD_TOKEN);





var repos = () => {
  var text;
  return new Promise((resolve, reject)=>{
    octokit.repos.listForOrg({
      org: 'Yuyay-Labs',
      type: 'all'
    }).then(data => {
      data.data.forEach(element => {
        var name = element.name;
        var url = element.url;
        text += ("Name: " + name + " 🔗URL: " + url + "\n");
      });
      resolve(text)
    }).catch(err=>{
      reject(err);
    })
  })
}



var allPR = () => {
  let msg = "";
  return new Promise((resolve, reject) => {
    octokit.paginate('GET /repos/:owner/:repo/pulls', {
      repo: 'atalaya',
      owner: 'Yuyay-Labs',
      state: "all"
    }).then(data => {
      data.forEach(element => {
        msg += ("Pull Request#" + element.number + " State: " + element.state +
          "User: " + element.user.login + "\n");
      });
      resolve(msg);
    }).catch(err => {
      reject(err);
    })
  })
}


var openPR = () => {
  let msg = "";
  return new Promise((resolve, reject) => {
    octokit.paginate('GET /repos/:owner/:repo/pulls', {
      repo: 'atalaya',
      owner: 'Yuyay-Labs',
      state: "all"
    }).then(data => {
      data.forEach(element => {
        if (element.state == "open") {
          msg += ("Pull Request#" + element.number + " State: " + element.state +
            " User: " + element.user.login + "\n");
        }
      });
      if(msg=""){
        msg="No open pull requests"
      }
      resolve(msg);
    }).catch(err => {
      reject(err);
    })
  })
}

var closedPR = () => {
  let msg = "";
  return new Promise((resolve, reject) => {
    octokit.paginate('GET /repos/:owner/:repo/pulls', {
      repo: 'atalaya',
      owner: 'Yuyay-Labs',
      state: "all"
    }).then(data => {
      data.forEach(element => {
        if (element.state == "closed") {
          msg += ("Pull Request#" + element.number + " State: " + element.state +
            " User: " + element.user.login + "\n");
        }
      });
      resolve(msg);
    }).catch(err => {
      reject(err);
    })
  })
}





