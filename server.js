// importing libraries 
const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

// 1st param -Path
// 2nd param -Function
app.get('/', greeting);
app.get('/recipes', getRecipes);


function greeting(request, response) {
    response.send("<h1> A+ Best Team USA </h1><ol><li>This is a list</li></ol>");
}
function getRecipes(request, response) {
    const url = `http://www.recipepuppy.com/api/?q=noodles`;

    superagent.get(url)
    .then(result => {
      const data = JSON.parse(result.text);
      response.send(data.results);
    })
    .catch(error => console.log(error));
}

// Starts server, always at end of file
app.listen(PORT, () => console.log(`Listening on port 3000***********************************************************************************************************************`));