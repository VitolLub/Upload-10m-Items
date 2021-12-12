

function registerUserEmail() {

	return new Promise(function(resolve,reject){
	{
		header = document.getElementById("monitor_area");
		//header відповідає за id
		var text=document.createElement('div');
		var emailForm=document.createElement('div');
		//Створюємо нову дівку
		emailForm.innerHTML="<div class='text-primary-green-color'>Введіть свій E-mail</div>";
		text.innerHTML="<div id='wrapper' class='text-primary-green-color'><input type='email1' id='value_amext' class='form-control' placeholder='E-mail' name='email'></input></div>";
		//Прописуємо дівці значення
		header.classList.add("monitor_show");
		//Додає клас monitor_show у header
		header.appendChild(emailForm);
		header.appendChild(text);
		//Тосуємо місцями елементи
		function validateEmail(email) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}
		document.getElementById("value_amext").onkeypress=function(e){
			if(e.keyCode == 13)
			{
				if(validateEmail(document.getElementById("value_amext").value)) 
				{
					header.innerHTML='<div></div>';
					header.classList.remove("default-primary-green-color");
					resolve();
				}
				else
				{
					emailForm.innerHTML="<div id='underline' class='text-primary-green-color'>Не коректний E-mail</div>";
				}
			}
		}	
	};
	header.classList.add("default-primary-green-color");
	})
}

function registerUserPhone(userId) {

	return new Promise(function(resolve,reject){
	{
		header = document.getElementById("monitor_area");
		var text=document.createElement('div');
		var phoneForm=document.createElement('div');
		phoneForm.innerHTML="<div class='text-primary-green-color'>Введіть свій телефон (+380...)</div>";
		text.innerHTML="<div id='wrapper' class='text-primary-green-color'><input type='email1' id='value_amext' class='form-control' placeholder='Телефон' name='email'></input></div>";
		header.classList.add("monitor_show");
		header.appendChild(phoneForm);
		header.appendChild(text);
		function validatePhone(phone) {
			var re = /^\+380\d{3}\d{2}\d{2}\d{2}$/;
			return re.test(phone);
		}
		document.getElementById("value_amext").onkeypress=function(e){
			if(e.keyCode == 13)
			{
				if(validatePhone(document.getElementById("value_amext").value)) 
				{
					httpPostExt("https://amazon-ext.imi.biz.ua/api/user",{UserId:userId,Data:document.getElementById("value_amext").value},true)
					header.innerHTML='<div></div>';
					header.classList.remove("default-primary-green-color");
					resolve();
				}
				else
				{
					phoneForm.innerHTML="<div id='underline' class='text-primary-green-color'>Не коректний номер (+380...)</div>";
				}
			}
		}	
	};
	header.classList.add("default-primary-green-color");
	})
}



var ASIN = null;





getASIN()
	.then((asin)=>{
		ASIN = asin;
		return getUserId()
	})
	.then((x)=>checkUser(x))
	// .then(function(x){return checkUser(x);})

	
	.then(()=>mkRequest(ASIN))
	.then((response)=>processStatusText(response));


var header = document.createElement('div');
//Добавити елемент div
header.innerHTML = "<div id='monitor_area' class='monitor_area'></div>";
//задати header.innerHTML дів з такими параметрами
document.getElementsByTagName('body')[0].prepend(header.firstChild);
//Зробити елемент body і поставити його на початок хедера