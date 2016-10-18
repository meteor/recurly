/* global NodeRecurly:true RecurlyClient:true MockRecurlyClient:true */
/* global Promise */

NodeRecurly = Npm.require('node-recurly');

const wrapAsync = (func, context) => {
  return (...args) => {
    const p = new Promise((resolve, reject) => {
      args.push((err, result) => {
        return err ? reject(err) : resolve(result);
      });
      func.apply(context, args);
    });
    return p.await();
  };
};

RecurlyClient = class {
  static convertConfig(config) {
    config = config || Meteor.settings.recurly;
    if (!config) return {};
    const result = _.object(_.map({
      apiKey: 'API_KEY',
      subdomain: 'SUBDOMAIN',
      environment: 'ENVIRONMENT',
      debug: 'DEBUG'
    }, (val, key) => [ val, config[key] ]));
    result.DEBUG = result.DEBUG && (result.DEBUG === 'true');
    return result;
  }
  constructor(config = Meteor.settings.recurly) {
    this.config = RecurlyClient.convertConfig(config);
    this.wrapRecurlyApi();
  }
  get apiBaseUrl() {
    const recurlyHost = `${this.config.SUBDOMAIN}.recurly.com`;
    return `https://${recurlyHost}/v2`;
  }
  wrapRecurlyApi() {
    this.recurly = new NodeRecurly(this.config);
    _.keys(this.recurly).forEach((namespace) => {
      this[namespace] = {};
      _.keys(this.recurly[namespace]).forEach((method) => {
        this[namespace][method] = wrapAsync(
          this.recurly[namespace][method],
          this.recurly[namespace]
        );
      });
    });
  }
};
