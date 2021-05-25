const spawn = require('child_process').spawn
const _ = require('underscore')

class Kubectl
{
    private type
    private binary
    private kubeconfig
    private namespace
    private endpoint
    private context

    constructor(type, conf)
    {
        this.type = type
        this.binary = conf.binary || 'kubectl'
        this.kubeconfig = conf.kubeconfig || ''
        this.namespace = conf.namespace || ''
        this.endpoint = conf.endpoint || ''
        this.context = conf.context || ''
    }

    private spawn(args, done)
    {
        const ops = new Array()

        if( this.kubeconfig ){
            ops.push('--kubeconfig='+this.kubeconfig)
        }
        else {
            ops.push('-s')
            ops.push(this.endpoint)
        }
        
        if (this.namespace) {
            ops.push('--namespace='+this.namespace)
        }

        if (this.context) {
            ops.push('--context='+this.context)
        }

        const kube = spawn(this.binary, ops.concat(args))
            , stdout = []
            , stderr = []
        
        kube.stdout.on('data', function (data) {
            stdout.push(data.toString())
        })
        
        kube.stderr.on('data', function (data) {
            stderr.push(data.toString())
        })
        
        kube.on('close', function (code) 
        {
            if( !stderr.length )
                return done(null, stdout.join(''))

            done(stderr.join(''))
        })
    }

    private callbackFunction(primise, callback)
    {
        if( _.isFunction(callback) )
        {
            primise.then(data=>{
                callback(null, data)
            }).catch(err=>{
                callback(err)
            })
        }
    }

    public command(cmd, callback): Promise<any>
    {
        if( _.isString(cmd) )
            cmd = cmd.split(' ')
            
        const promise = new Promise((resolve, reject) => 
        {
            this.spawn(cmd, function(err, data)
            {
                if( err )
                    return reject(err || data)
                
                resolve(cmd.join(' ').indexOf('--output=json') > -1 ? JSON.parse(data): data)
            })
        })
        
        this.callbackFunction(promise, callback)
        
        return promise
    }

    public list(selector, flags?, done?)
    {
        if( !this.type )
            throw new Error('not a function')
        
        if( typeof selector === 'object')
        {
            var args = '--selector='
            
            for( var key in selector )
                args += (key + '=' + selector[key])
            
            selector = args + ''
        }
        else{
            done = selector
            selector = '--output=json'
        }

        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []
        
        const action = ['get', this.type , selector, '--output=json'].concat(flags)

        return this.command(action, done)
    }

    public get(name: string, flags?, done?: (err, data)=>void)
    {
        if( !this.type )
            throw new Error('not a function')
         
        
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []

        const action = ['get', this.type, name, '--output=json'].concat(flags)

        return this.command(action, done)
        
    }

    public create(filepath: string, flags?, done?: (err, data)=>void)
    {
        if( !this.type )
            throw new Error('not a function')
        
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []

        const action = ['create', '-f', filepath].concat(flags)

        return this.command(action, done)
    }

    public delete(id: string, flags, done?: (err, data)=>void)
    {
        if( !this.type )
            throw new Error('not a function')
            
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []

        const action = ['delete', this.type, id].concat(flags)

        return this.command(action, done)
    }

    public update(filepath: string, flags?, done?: (err, data)=>void)
    {
        if( !this.type )
            throw new Error('not a function')
        
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []

        const action = ['update', '-f', filepath].concat(flags)

        return this.command(action, done)
    }

    public apply(name: string, json: Object, flags?, done?: (err, data)=>void)
    {
        if( !this.type )
            throw new Error('not a function')
        
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []
        const action = ['update',  this.type, name, '--patch='+ JSON.stringify(json)].concat(flags)

        return this.command(action, done)
    }

    public rollingUpdateByFile(name: string, filepath: string, flags?, done?: (err, data)=>void)
    {
        if( this.type !== 'replicationcontrollers' )
            throw new Error('not a function')

        
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []
        const action = ['rolling-update',  name, '-f', filepath, '--update-period=0s'].concat(flags)

        return this.command(action, done)
    }


    public rollingUpdate(name: string, image: string, flags?, done?: (err, data)=>void)
    {
        if( this.type !== 'replicationcontrollers' )
            throw new Error('not a function') 
        

        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []

        const action = ['rolling-update',  name, '--image=' + image, '--update-period=0s'].concat(flags)

        return this.command(action, done)
    }

    public scale(name: string, replicas: string, flags?, done?: (err, data)=>void)
    {
        if( this.type !== 'replicationcontrollers' && this.type !== 'deployments' )
            throw new Error('not a function')
        
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []
        const action = ['scale', '--replicas=' + replicas, 'replicationcontrollers', name].concat(flags)

        return this.command(action, done)
    }

    public logs(name: string, flags?, done?: (err, data)=>void)
    {
        if( this.type !== 'pods' )
            throw new Error('not a function')

        var action = new Array('logs')

        if (name.indexOf(' ') > -1) {
            var names = name.split(/ /)
            action.push(names[0])
            action.push(names[1])
        } else {
            action.push(name)
        }

        
        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []

        return this.command(action.concat(flags), done)
    }

    public describe(name: string, flags?, done?: (err, data)=>void)
    {
        if( !this.type )
            throw new Error('not a function')

        var action = new Array('describe', this.type)

        if ( name === null ) {
            action.push(name)
        }

        if( _.isFunction(flags) ){
            done = flags
            flags = null
        }

        flags = flags || []

        return this.command(action.concat(flags), done)
    }

    public portForward(name: string, portString: string, done?: (err, data)=>void)
    {
        if( this.type !== 'pods' )
            throw new Error('not a function')

        var action = new Array('port-forward', name, portString)

        return this.command(action, done)
    }

    public useContext(context: string, done?: (err, data)=>void)
    {
        var action = new Array('config', 'use-context', context)
        
        return this.command(action, done)
    }

    public viewContext(done?: (err, data)=>void)
    {
        var action = new Array('config', '--output=json', 'view')
        
        this.command(action, done)
    }
}

declare function require(name:string)

export = (conf):any=>
{
	return {
    // short names are just aliases to longer names
		pod: new Kubectl('pods', conf)
		, po: new Kubectl('pods', conf)
		, replicationcontroller: new Kubectl('replicationcontrollers', conf)
		, rc: new Kubectl('replicationcontrollers', conf)
		, service: new Kubectl('services', conf)
		, svc: new Kubectl('services', conf)
		, node: new Kubectl('nodes', conf)
		, no: new Kubectl('nodes', conf)
		, namespace: new Kubectl('namespaces', conf)
		, ns: new Kubectl('namespaces', conf)
		, deployment: new Kubectl('deployments', conf)
		, daemonset: new Kubectl('daemonsets', conf)
		, ds: new Kubectl('daemonsets', conf)
		, secrets: new Kubectl('secrets', conf)
		, endpoint: new Kubectl('endpoints', conf)
		, ep: new Kubectl('endpoints', conf)
		, ingress: new Kubectl('ingress', conf)
		, ing: new Kubectl('ingress', conf)
        , job: new Kubectl('job', conf)
        , context: new Kubectl('context', conf)
        , command: function(){
            arguments[0] = arguments[0].split(' ')
            return this.pod.command.apply(this.pod, arguments)
        }
	}
}
