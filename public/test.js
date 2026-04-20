/**
 * test.js - Suite de Testes Unitários (v2.3)
 * Execute no console do navegador importando as funções ou via <script type="module">
 */

import { extractJSON } from './api.js';
import { escHtml } from './ui.js';

async function runTests() {
    console.log('🧪 Iniciando testes unitários...');
    
    const tests = [
        {
            name: 'extractJSON - array limpo',
            fn: () => extractJSON('[{"id":"test"}]'),
            expected: [{"id":"test"}]
        },
        {
            name: 'extractJSON - com markdown',
            fn: () => extractJSON('```json\n[{"id":"test"}]\n```'),
            expected: [{"id":"test"}]
        },
        {
            name: 'extractJSON - com texto extra',
            fn: () => extractJSON('Aqui está o JSON: [{"id":"abc"}] espero que goste.'),
            expected: [{"id":"abc"}]
        },
        {
            name: 'escHtml - XSS básico',
            fn: () => escHtml('<script>alert(1)</script>'),
            expected: '&lt;script&gt;alert(1)&lt;/script&gt;'
        },
        {
            name: 'escHtml - Atributos',
            fn: () => escHtml('text "quote" & ampersand'),
            expected: 'text &quot;quote&quot; &amp; ampersand'
        }
    ];

    let passed = 0;
    tests.forEach(t => {
        try {
            const result = t.fn();
            const success = JSON.stringify(result) === JSON.stringify(t.expected);
            if (success) {
                console.log(`✅ ${t.name}`);
                passed++;
            } else {
                console.error(`❌ ${t.name} FALHOU:`, { expected: t.expected, got: result });
            }
        } catch (err) {
            console.error(`❌ ${t.name} ERROU:`, err);
        }
    });

    console.log(`\n📊 Resultado: ${passed}/${tests.length} testes passaram.`);
}

// Auto-executa se for carregado separadamente
if (window.location.search.includes('test=true')) {
    runTests();
}

export { runTests };
