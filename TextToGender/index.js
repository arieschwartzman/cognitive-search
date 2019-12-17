
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
    if (!gender) {
        return 'undefined';
    }
    var g = g.trim().toLowerCase();
    g = gender.replace(/-/g," "); 
    const split = g.split(" ");

    var male = ['man','male','he','his','mr','mr.','dad','uncle','brother','boy','father','guy','fellow','gentleman','grandfather','husband','sir','son'];
    var female = ['woman','female','she','her','ms','miss','mrs','mother','mom','sister','aunt','lady','madam','girl','daugther','gal','gentlewoman'];
    for (var j = 0; j < split.length; j++) {
        if (male.indexOf(split[j]) >=0) {
            return "male";
        }
        if (female.indexOf(split[j]) >= 0) {
            return "female";
        }
    }
    return "unknown";
}