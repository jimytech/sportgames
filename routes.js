const routes = require('next-routes')();

routes
.add('/tournaments/new', '/tournaments/new')
.add('/tournaments/:address', '/tournaments/tournamentregis')
.add('/tournaments/registered/:address', '/tournaments/registered/index')
.add('/tournaments/finished/tournamentsfinish', '/tournaments/finished/tournamentsfinish')
.add('/tournaments/finished/pickwinners/:address', '/tournaments/finished/pickwinners/index')
.add('/tournaments/finished/winners/:address', '/tournaments/finished/winners/index')
module.exports = routes;