import Fastify from 'fastify'
const fastify = Fastify({
    logger:true
})

fastify.get('/',function(request,reply){
    reply.send('hello world')
    //return 'hello world'
})

fastify.listen({port:3000},function(err,address){
    if(err){
        fastify.log.error(err)
        process.exit(1)
    }
})