function log(txt){
	document.body.appendChild(document.body.createTextNode(txt));
}

function zip(arrays){
    return arrays[0].map(function(_, i){
        return arrays.map(function(array){ return array[i]})
    });
}

function format(s, o){
    return s.replace(/{([^{}])*}/g, function(){
        var r = o[Object.prototype.toString.call(o)==='[object array]'? parseInt(arguments[1], 10): arguments[1]];
        return typeof r === 'string' || typeof r === 'number' ? r: arguments[0];
    });
}

function repeat(s, n){
    var ret = '';
    for (var i = 0; i < n; i ++ ){
        ret += s;
    }
    return ret;
}

function solve(key){
    debugger;
    var variables = expressions[key],
        variables_zip = zip(variables),
        mask = '{0}({1}): {2} => {3}',
        formatter = {
            'v': function(v, fix){ fix = fix || 3; return ((v - Math.floor) <= 0.5 ? Math.floor(v) : Math.ceil(v)).toFixed(fix); },
            '%s': function(v){ return (v || 0).toFixed(3)+ '%'; },
            'i': function(v){ return formatter.v(v, 0); }
        },
        help = 'Explicação do conteúdo entre colchetes:\n' +
               '(v) => valor com 3 casas decimais\n' + 
               '(%) => percentual com 3 casas decimais\n' +
               '(i) => valor inteiro';
    console.log(help);
    while(true) {
        console.log('\n'+key+'\n');
        for (var i = 0, j = variables.length; i < j; i ++){
            console.log(format(mask, variables[i]));   
        }
        var calculate = ' ';
        while (variables_zip[0].indexOf(calculate)===-1){
            calculate = prompt('Váriavel que deseja calcular: ');
            if (!calculate) {return;}
        }
        var pos = variables_zip[0].indexOf(calculate),
            f = variables_zip[3][pos],
            f2 = f.replace(/Math\.\w+/, ''),
            vf = f2.match(/\w+/g).filter(function(v){
            	return (v!==calculate) && (!v.test(/^\d$/));
            }),
            f2 = f;
        for (var i=0, j = vf.length; i<j; i++){
            var v = prompt(format('Digite o valor de {0}', [vf[i]]));
            if (!v){
                return;
            }
            if (v.indexOf('%')!==-1){
                v = format('({0}/100.0)', v.replace('%',''));
            }
            f2 = f2.replace((new RegExp(format('\\b{0}\\b', [vf[i]]))), v);
        }
      	if (f2.indexOf('=')!==-1){
            var result = solve_with_greedy_bissection(calculate, f2);
        } else {
            var result = eval(f2.replace(/([0-9.]+)\ +?\^\ +?([0-9.]+)/, function(){ return format('Math.pow({1}, {2})', arguments)}));
        }
        console.log(format('\n{0}: {1}', [calculate, f]));
        console.log(format('{0}: {1}', [calculate, f2]));
        result = formatter[variables[pos][1]](result);
        console.log(format('{0} = {1}', [calculate, result]));

    }
}

function solve_with_greedy_bissection(i,f){
    debugger;
    var f1, f2 = f.split('=');
    try{
        var r = parseFloat(f1),
            f = f2.replace(/([0-9.]+)\ +?\^\ +?([0-9.]+)/, function(){ return format('Math.pow({1}, {2})', arguments) });
    } catch(e){
        var r = parseFloat(f2),
            f = f1.replace(/([0-9.]+)\ +?\^\ +?([0-9.]+)/, function(){ return format('Math.pow({1}, {2})', arguments) });
    }
    var v = 0;
    while (true){
        try {
            var regex = new RegExp(format('\\b{0}\\b', [i])),
                c = eval(f.replace(regex, v+''));
            if (c === Infinity){
                throw new Error('ZeroDivisionError');
            }
            break;
        } catch (e){
            v += 1;
        }
    }
    var vmin = -1e10 -1, vmax = 1e10;
    while(Math.abs(r - c) > 0.00001){
        if (c > r){
            vmax = v;
        } else {
            vmin = v;
        }
        v = (vmin + vmax) / 2;
        f.format(regex, v +'');
        c = eval(f.replace(regex, v+''))
        if (c===Infinity){
            throw new Error('ZeroDivisionError');
        }
    }
}

var expressions = {};
expressions['Juros simples'] = [
    ['S' , 'v', 'Valor futuro', 'P * (1 + i * n)'],
    ['P' , 'v', 'Valor presente', 'S / (1 + i * n)'],
    ['J' , 'v', 'Valor dos juros em valor', 'P * i * n'],
    ['J2', 'v', 'Valor dos juros em valor', 'S - P'],
    ['j' , '%', 'Juros final ou custo efetivo', 'i * n'],
    ['j2', '%', 'Juros final ou custo efetivo', '(S - P) / P'],
    ['i' , '%', 'Taxa por período', '(S / P - 1) / n'],
    ['n' , 'i', 'Número de períodos', '(S / P - 1) / i'],
];
 
expressions['Juros compostos'] = [
    ['S' , 'v', 'Valor futuro', 'P * (1 + i) ^ n'],
    ['P' , 'v', 'Valor presente', 'S / (1 + i) ^ n'],
    ['J' , 'v', 'Valor dos juros em valor', 'P * ((1 + i) ^ n - 1)'],
    ['J2', 'v', 'Valor dos juros em valor', 'S - P'],
    ['j' , '%', 'Juros final ou custo efetivo', '(1 + i) ^ n - 1'],
    ['j2', '%', 'Juros final ou custo efetivo', '(S - P) / P'],
    ['i' , '%', 'Taxa por período', '(S / P) ^ (1 / n) - 1'],
    ['n' , 'i', 'Número de períodos', 'Math.log(S / P) / Math.log(1 + i)'],
];
 
expressions['Amortização em parcelas iguais sem entrada'] = [
    ['R' , 'v', 'Valor da parcela', 'P * i * (1 + i) ^ n / ((1 + i) ^ n -1)'],
    ['S' , 'v', 'Valor futuro', '((R * 1 + i) ^ n - 1) / i'],
    ['P' , 'v', 'Valor presente', 'R * ((1 + i) ^ n - 1) / (i * (1 + i) ^ n)'],
    ['j' , '%', 'Juro ou custo efetivo total', '(n * R - P) / P'],
    ['i' , '%', 'Taxa por perído - chuta-se uma até chegar em R', 'R = P * i * (1 + i) ^ n / ((1 + i) ^ n -1)'],
    ['n' , 'i', 'Número de parcelas', 'Math.log(1 / (1 - i * P / R)) / Math.log(1 + i)'],
];
 
expressions['Amortização em parcelas iguais com entrada'] = [
    ['R' , 'v', 'Valor da parcela', 'P * i * (1 + i) ^ (n - 1) / ((1 + i) ^ n -1)'],
    ['n' , 'i', 'Número de parcelas incluindo a entrada', 'n'],
];

solve('Amortização em parcelas iguais sem entrada');