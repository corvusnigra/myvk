/**
 * Created by URIY on 01.11.2016.
 */
new Promise( function (resolve) {
    if(document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then( function () {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 5695336
        });

        VK.Auth.login(function (response) {
            if(response.session) {
                resolve(response);
            } else {
                reject( new Error('Не удалось авторизироваться'));
            }
        },2 | 4 | 8)
    })

}).then( function () {
    return new Promise(function (resolve, reject) {
        VK.api('friends.get', {'fields':'photo_50,bdate'},
            function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    console.log(response);
                    Handlebars.registerHelper('formatAge', function(bdate) {
                        var year = new Date().getFullYear();
                        var byear = String(bdate).split('.');
                        if(byear.length == 3) {
                           var useryear = parseInt(year) - parseInt(byear.pop());
                        }
                        return useryear;
                    });

                    var userTemplate = document.querySelector('#userTemplate');
                    var userArea = document.querySelector('#userArea');
                    var source = userTemplate.innerHTML;
                    var templateFn = Handlebars.compile(source);
                    var template = templateFn({list: response.response});
                    userArea.innerHTML = template;
                    resolve();
                }
            });
    })
});