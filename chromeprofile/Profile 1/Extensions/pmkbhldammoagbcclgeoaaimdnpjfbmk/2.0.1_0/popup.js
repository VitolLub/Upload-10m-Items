function openSite()
{
    window.open("https://www.amzsmart.biz/","_blank")
}

function asinValue()
{
    var asin = document.getElementById("ASIN");
    return asin.value;
}

var app = new Vue({
    el: '#app',
    data: {
      page:0,
      email:null,
      asin:null
    },
    created:function(){
        var self=this;
        this.$data.page=8;
		self.$data.page=200;
		return;
        chrome.tabs.executeScript({
            code: '(' + asinValue + ')();' //argument here is a string but function.toString() returns function's code
        }, (results) => {
            console.log(1);
            //Here we have just the innerHTML and not DOM structure

            //ASIN true -> проверка зареган ? проверка товара : регистрация
            if(results[0]!=null)
            {
                
                this.$data.asin = results[0];
                getUserId()
                
                    .then((x)=>checkUser(x))
                    .then((x)=>{
                        if(x==true)
                        {
                            self.$data.page=2;
                        }else{
                            self.$data.page=1;
                        }
                    })
                
                
            }else{
                // Товара нет
                self.$data.page=4;
            }
        });
    },
    methods:{
        keymonitor: function(event) {
            
            if(validateEmail(this.$data.email)) 
            {     this.$data.page=7;
                getUserId()
                .then(x=>httpPostExt("https://amazon-ext.imi.biz.ua/api/user",
                {UserId:x,Data:this.$data.email},true))
                .then((x)=>this.$data.page=2)     
            }
        },
        registerEmail:function(){
            console.log(this.$data.email);
            this.keymonitor();
        },
        checkProduct:function(){
            var self=this;
            self.$data.page=3;
            // Проверка товара (проверяет)
            mkRequest(this.$data.asin )
            .then(response=>processStatusText(response))
            .then(res=>{
                if(res){
                    self.$data.page=5;
                }else{
                    self.$data.page=6;
                }
            });
      },
      openSite:function(){
        chrome.tabs.executeScript({
            code: '(' + openSite + ')();' //argument here is a string but function.toString() returns function's code
        }, (results) => {});
      }
    }
})