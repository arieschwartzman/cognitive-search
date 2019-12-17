const { getGender } = require('gender-detection-from-name')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.gender) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: { gender: getGender(req.query.gender) }
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};


function getGender(gender) {

    var g = gender.trim().toLowerCase();
    var male = ['man','male','he','his','mr','mr.','dad','uncle','brother'];
    var female = ['woman','female','she','her','ms','miss','mrs','mother','mom','sister','aunt'];

    if (male.indexOf(g) >=0) {
        return "male";
    }
    if (female.indexOf(g) >= 0) {
        return "female";
    }
    return "unknown";
}