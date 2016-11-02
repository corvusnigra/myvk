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

                    Handlebars.registerHelper('formatAge', function(bdate) {
                        var year = new Date().getFullYear();
                        var byear = String(bdate).split('.');
                        if(byear.length == 3) {
                           var useryear = parseInt(year) - parseInt(byear.pop());
                        }
                        return useryear;
                    });


                    var result = [];
                    for(var i = 0;i < response.response.length; i++){
                        var userbdate = response.response[i].bdate;
                        var arrdate = String(userbdate).split('.');
                        if(arrdate && arrdate.length >= 2){
                            var day = arrdate[0];
                            var month = arrdate[1];
                            var resb = new Date(new Date().getFullYear(), month-1, day).getTime();
                            var newobj = response.response[i];
                            newobj.date =resb;
                            result.push(newobj)
                        }

                    };
                    console.log(newobj)

                    var now = new Date().getTime();
                    var newresult = result.filter(function (item){
                        var filter = item.date;
                        return filter > now

                    });

                   newresult.sort(function(a,b){
                        return a.date - b.date;
                    });

                    result.forEach(function (item) {
                        if(newresult.indexOf(item) == -1){
                            newresult.push(item);
                        }
                    });


                    var userTemplate = document.querySelector('#userTemplate');
                    var userArea = document.querySelector('#userArea');
                    var source = userTemplate.innerHTML;
                    var templateFn = Handlebars.compile(source);
                    var template = templateFn({list: newresult});
                    userArea.innerHTML = template;
                    resolve();
                }
            });
    })
});