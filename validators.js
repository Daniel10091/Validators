$(document).ready(function(params) {
  $('#cpf').mask('000.000.000-00');
  $('#telefone').mask('(00) 00000-0000');
  $('#cep').mask('00000-000');

  var nomeCracha = $('.form-control#nomeCracha');
  var email = $('.form-control#email');
  var telefone = $('.form-control#telefone');
  var cpf = $('.form-control#cpf');
  var cep = $('.form-control#cep');

  nomeCracha.on('input', () => {
    // var nome = nomeCracha.val().replace(/\s+/g, ' ').trim();
    var maxLength = 16;
    var alertMessage = nomeCracha.parent().find('.form-control-alert');

    if (nomeCracha.val().length >= maxLength) {
      nomeCracha.val(nomeCracha.val().substring(0, maxLength));
      alertMessage.show().text('Nome do crachá não pode ultrapassar 16 caracteres.');
    } else {
      alertMessage.hide().text('');
    }
  });

  email.on('blur', () => {
    if (email.val() != '' && email.val().length > 0) {
      if (!emailValidator(email.val())) {
        alert('E-mail inválido');
        setTimeout(() => {
          email.val('').focus();
        }, 0);
      }
    }
  });
  
  telefone.on('keyup', () => {
    if (telefone.val().length > 0) {
      if (/* telefone.val().indexOf(' ') != -1 ||  */isNaN(telefone.val()[telefone.val().length-1])) { // impede entrar outro caractere que não seja número
        telefone.val(telefone.val().substring(0, telefone.val().length-1));
        return;
      }
      // value = telefone.val().replace(/[^\d]+/g, '');
      // if (value.length >= 11) {
      //   telefone.val(telefone.val().slice(0, -1));
      // }
    }
  });
  
  telefone.on('blur', () => {
    if (telefone.val() != '' && telefone.val().length > 0) {
      if (!phoneValidator(telefone.val())) {
        alert('Telefone inválido');
        setTimeout(() => {
          telefone.val('').focus();
        }, 0);
      }
      telefone.val(phoneFormater(telefone.val()));
    }
  });
  
  cpf.on('keyup', () => {
    if (cpf.val().length > 0) {
      if (cpf.val().indexOf(' ') != -1 || isNaN(cpf.val()[cpf.val().length-1])) { // impede entrar outro caractere que não seja número
        cpf.val(cpf.val().substring(0, cpf.val().length-1));
        return;
      }
      value = cpf.val().replace(/[^\d]+/g, '');
      if (value.length > 11) {
        cpf.val(cpf.val().slice(0, -1));
      }
    }
  });
  
  cpf.on('blur', () => {
    if (cpf.val() != '' && cpf.val().length > 0) {
      if (!cpfValidator(cpf.val())) {
        alert('CPF inválido');
        setTimeout(() => {
          cpf.val('').focus();
        }, 0);
      } else {
        cpf.val(cpf.val().replace(/[^\d]+/g, ''));
        cpf.val(cpf.val().match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/,"-"));
      }
    }
  });

  cep.on('keyup', function() {
    if (cep.val().length > 0) {
      if (cep.val().indexOf(' ') != -1 || isNaN(cep.val()[cep.val().length-1])) { // impede entrar outro caractere que não seja número
        cep.val(cep.val().substring(0, cep.val().length-1));
        return;
      }
      if (cep.val().replace(/[^\d]+/g, '').length > 8) {
        cep.val(cep.val().substring(0, 8));
      } else if (cep.val().replace(/[^\d]+/g, '').length == 8) {
        if (!cepValidator(cep.val())) {
          alert('CEP inválido');
          setTimeout(() => {
            cep.val('').focus();
          }, 0);
          return;
        } else {
          searchCep(cep.val());
        }
      }
    }
  });
  
  cep.on('blur', () => {
    if (cep.val() != '' && cep.val().length > 0) {
      // value = cep.val().replace(/[^\d]+/g, '');
      if (!cepValidator(cep.val())) {
        alert('CEP inválido');
        setTimeout(() => {
          cep.val('').focus();
        }, 0);
      }
    }
    if (cep.val() != '' && cep.val().length >= 8) {
      cep.val(cepFormater(cep.val()));
    }
  });

  function emailValidator(email) {
    if (email != '' && email.length > 0) {
      // return /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i.test(email);
      return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(email);
    }
  }
  
  function phoneValidator(number) {
    if (number != '' && number.length > 0) {
      let result = number.replace(/[^\d]+/g, '');
      return result.length == 10 || result.length == 11;
    }
  }
  
  function phoneFormater(number) {
    if (number != '' && number.length > 0) {
      let result = number.replace(/[^\d]+/g, '');
      if (result.length == 10) {
        return result.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        return result.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
  }
  
  function cpfValidator(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
    return true;
  }
  
  function cepValidator(cep) {
    // if (cep != '' && cep.length >= 8) {
    //   return /^[0-9]{8}$/i.test(cep);
    // }
    cep = cep.replace(/[^\d]+/g, '');
    // Elimina CPFs invalidos conhecidos
    if (cep.length != 8 || 
        cep == "00000000" || 
        cep == "11111111" || 
        cep == "22222222" || 
        cep == "33333333" || 
        cep == "44444444" || 
        cep == "55555555" || 
        cep == "66666666" || 
        cep == "77777777" || 
        cep == "88888888" || 
        cep == "99999999") 
        return false;
    
    return cep.length == 8 || cep.length == 9;
  }
  
  function cepFormater(cep) {
    if (cep != '' && cep.length >= 8) {
      return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
  }
  
  function clearCepForm() {
    $('#cep').val('').focus();
    $('#endereco').val('');
    $('#complemento').val('');
    $('#bairro').val('');
    $('#cidade').val('');
    $('#estado').val('');
  }
  
  function searchCep(value) {
    var cep = value.replace(/\D/g, '');
    
    if (cep != '' && cep.length >= 8) {
      var validacep = /(\d{5})(\d{3})/; // /^[0-9]{8}$/
      
      if (validacep.test(cep)) {
        $('#endereco').val('...');
        $('#complemento').val('...');
        $('#bairro').val('...');
        $('#cidade').val('...');
        $('#estado').val('...');

        $.ajax({
          type: 'GET',
          url: 'https://viacep.com.br/ws/'+ cep + '/json/',
          dataType: 'json',
          success: function(data) {
            if (!('erro' in data)) {
              $('#endereco').val(data.logradouro);
              $('#complemento').val(data.unidade);
              $('#bairro').val(data.bairro);
              $('#cidade').val(data.localidade);
              $('#estado').val(data.uf);
            } else {
              clearCepForm();
              alert('CEP não encontrado.');
            }
          }
        });

        // $('script#searchCep').remove();
        
        // var script = $('<script/>');
        
        // script.attr('id', 'searchCep');
        // script.attr('type', 'text/javascript');
        // script.attr('src', 'https://viacep.com.br/ws/'+ cep + '/json/?callback=cep_callback');
        // $('body').append(script);
      } else {
        clearCepForm();
        alert('Formato de CEP inválido.');
      }
    } else {
      clearCepForm();
    }
  }
});
