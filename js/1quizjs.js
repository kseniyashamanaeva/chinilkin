const main = {
	name:'Тестовый квиз',
	handler: 'php/h.php'
};


const template = {
	form: '<form method="POST" class="quiz-form-{quiz-id}" action="'+main.handler+'">{quiz-questions}</form>',
	question: {
		wrapper: '<div class="quiz-wrapper-{question-id} display-none" >{content}</div>',
		question: '<p style="font-size: 18px; font-weight: 800; margin-bottom: 0px;">{question}</p>',
		description:'<p>{description}</p>',
		attachment: '<img class="quiz-attach" src="{url}">',
	},

	answer:{
		radio:'<div class="form-check"><label class="form-check-label" style="font-size:18px; margin-top: 5px; padding-bottom: 5px;"><input class="form-check-input" style="" type="radio" name="{name}" value="{value}">{answer}</label></div>',
		checkbox:'<div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input" name="{name}" value="{value}">{answer}</label></div>',
		select:{wrapper: '<select name="{name}" class="form-control">{options}</select>', each:'<option value="{value}">{answer}</option>'},
		text: '<input class="form-control " type="text" name="{name}" placeholder="{answer}">',
		phone:'<input data-mask="(999) 999-9999" class="form-control phone-mask valid" type="tel" placeholder="+7 (999) 99 99 999" name="{name}" required />',
		number:'<input class="form-control" type="number" name="{name}" placeholder="{answer}">'
	},

	interface:{
		next:'<button class="btn btn-rounded btn-primary btn-lg quiz-btn-next">Следующий вопрос</button>',
		prev:'<button  class="btn  btn-rounded btn-secondary btn-lg quiz-btn-prev my-3">Назад</button>',
		submit:'<button  class="btn  btn-rounded btn-primary btn-lg quiz-btn-submit my-3">Получить расчет стоимости</button>',
		cancel:'<button  class="quiz-btn-cancel">Cancel</button>'
	} 

};

const questions = [
	{
		id:0,
		question:'Какая у Вас модель iPhone?',
		description: 'выберите ваш вариант', 
		answer: {
			type:'radio',
			vars: ['11 | 11 Pro | 11 Pro Max', 'X | XR | XS | XS Max', '8 Plus', '8', '7 Plus', '7', '6s Plus','6s', '6 Plus', '6', '5 | 5c | 5s | SE']
		}
	},
	{
		id:1,
		question:'Что случилось с устройством?',
		description: 'выберите ваш вариант', 
		answer: {
			type:'radio',
			vars: ['Разбилось стекло дисплея', 'Нет изображения', 'Внутрь попала вода', 'Не включается', 'Проблемы с аккумулятором', 
			'Не работает сенсор', 'Не работает камера', 'Погнулся корпус', 'Проблема с динамиком', 'Не работает кнопка', 'Другая неисправность'
			]
		}
	},
	{
		id:2,
		question:'Введите Ваш номер телефона',
		description: 'мы позвоним вам и уточним стоимость',
		answer: {
			type:'phone',
			vars: 'Телефон'
		}
	},

];

function genQuestionDOM(q)
{
	let wrapper = template.question.wrapper.replace('{question-id}', q.id);
	//console.log(wrapper);

	let question = template.question.question.replace('{question}', q.question);
	//console.log(question);

	let description = template.question.description.replace('{description}', q.description)
	//console.log(description);

	if(typeof(q.attachment) != "undefined" && q.attachment !== null){
		console.log('Have an attachment!');
	}
	let answer = '';
	switch (q.answer.type){
			case 'radio':
				q.answer.vars.forEach(el=>answer+=template.answer.radio.replace('{answer}', el).replace('{name}', 'quiz-answer-'+q.id).replace('{value}', 'quiz-val-'+q.answer.vars.indexOf(el)));
				break;

			case 'checkbox':
				q.answer.vars.forEach(el=>answer+=template.answer.checkbox.replace('{answer}', el).replace('{name}', 'quiz-answer-'+q.id).replace('{value}', 'quiz-val-'+q.answer.vars.indexOf(el)));
				break;

			case 'select':
				q.answer.vars.forEach(el=>answer+=template.answer.select.each.replace('{answer}', el).replace('{value}', 'quiz-val-'+q.answer.vars.indexOf(el)));
				answer = template.answer.select.wrapper.replace('{options}', answer).replace('{name}', 'quiz-answer-'+q.id);
				break;

			case 'text':
				answer+=template.answer.text.replace('{answer}', q.answer.vars).replace('{name}', 'quiz-answer-'+q.id);
				break;

			case 'phone':
				answer+=template.answer.phone.replace('{answer}', q.answer.vars).replace('{name}', 'quiz-answer-'+q.id);
				break;

			case 'number':
				answer+=template.answer.number.replace('{answer}', q.answer.vars).replace('{name}', 'quiz-answer-'+q.id);
				break;
	}

	let interface = template.interface.next;

	let content = question+description+answer+'<br><div class="text-center">'+interface+template.interface.submit+'</div>'+template.interface.prev;

	let result = wrapper.replace('{content}', content);
	return result;

}

function genQuestionsDOM(id)
{
	let answer = '';
	questions.forEach(el=>answer+=genQuestionDOM(el));
	let result = template.form.replace('{quiz-questions}', answer).replace('{quiz-id}', id);
	return result;
}

function buildQuiz(el, id)
{
	let questionsDOM = genQuestionsDOM(id);
	$(el).html(questionsDOM+'<style>.display-none{display:none !important}</style>');
	$(".quiz-wrapper-0").removeClass('display-none');
	$(".quiz-btn-prev").addClass('display-none');
	$(".quiz-btn-submit").addClass('display-none');
	var number = 0;
	$(".quiz-btn-next").click(function(e){
		e.preventDefault();
		let next = number+1;
		if(next+1 == questions.length){
			$(".quiz-btn-next").addClass('display-none');
			$(".quiz-btn-submit").removeClass('display-none');
		}else{
			$(".quiz-btn-next").removeClass('display-none');
			$(".quiz-btn-submit").addClass('display-none');
		}

		if(number+1!=0){
	
			$(".quiz-btn-prev").removeClass('display-none');
		}
			
			$(".quiz-wrapper-"+number).addClass('display-none');
			$(".quiz-wrapper-"+next).removeClass('display-none');
			number++;
		
	});

	$(".quiz-btn-prev").click(function(e){
		e.preventDefault();
		alert("test");
		if(number-2<0){
			$(".quiz-btn-prev").addClass('display-none');
		}else{
			$(".quiz-btn-prev").removeClass('display-none');
		}
		let next = number-1;
		if(next+1 == questions.length){
			$(".quiz-btn-next").addClass('display-none');
			$(".quiz-btn-submit").removeClass('display-none');

		}else{
			$(".quiz-btn-next").removeClass('display-none');
			$(".quiz-btn-submit").addClass('display-none');
		}
		$(".quiz-wrapper-"+number).addClass('display-none');
		$(".quiz-wrapper-"+next).removeClass('display-none');
		number--;
	});

	$(".quiz-btn-submit").click(function(e){
		e.preventDefault();
		let form_data = $('.quiz-form-'+id).serialize();
		let questions_data = questions;
		if(validate('.quiz-form-'+id)){
			$.ajax({
			method: "POST",
		  	url: main.handler,
		  	data: {answers: form_data, questions:questions},
		  	success: function(r){
		  		console.log(r);
		    	

	  	  	}

			}); 
		alert('Наш менеджер свяжется с вами и назовёт точную цену');

		}
		   
    
		

	});
	
}

function validate(form)
{
	let $form = $(form);
	let trigger = 0;
$form.find('input,select').each(function() {
    let $this = $(this);

    if ($this.val() == "" && $this.prop("checked", false)) {
      alert('Заполните все поля!');
      trigger = 1;
    }
});
	if(trigger == 1){
		return false;
	}

	return true;
}

function startQuiz(el)
{

	
}

$(document).ready(function() {
	buildQuiz('.quiz-main-iphone', 'test-quiz');

});