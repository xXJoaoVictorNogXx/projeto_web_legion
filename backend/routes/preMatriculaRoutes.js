// backend/routes/preMatriculaRoutes.js
const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.post('/pre-matricula', async (req, res) => {
  try {
    // 1. Desestruturar os dados do frontend.
    // Isso nos permite validar e tratar cada campo.
    const data = req.body;

    // 2. Validação Mínima (você pode adicionar mais)
    if (!data.childName || !data.guardianName || !data.guardianCpf) {
      return res.status(400).json({ error: "Nome da criança, nome do responsável e CPF do responsável são obrigatórios." });
    }

    // 3. Mapeamento seguro dos campos (evita SQL Injection)
    // CORREÇÃO: Corrigido o typo "adresss" para "address_street"
    const fields = [
      'childName', 'birthDate', 'gender', 'race', 'susCard', 'hasHealthIssues',
      'healthIssuesDescription', 'hasGovernmentAid', 'governmentAidDescription',
      'guardianName', 'guardianCpf', 'guardianPhone', 'guardianWorkplace', 'guardianRg',
      'addressStreet', 'addressNumber', 'addressNeighborhood', 'addressCity', 'addressState', 'addressCep',
      'birthCertificateNumber', 'birthCertificateCity', 'birthCertificateRegistryOffice',
      'birthCertificateRegistryCity', 'childCpf', 'childRg', 'childRgIssueDate',
      'childRgIssuingAuthority',
      'casaPropria', 'casaAlugada', 'casaCedida', 'pisoLajota', 'pisoChaoBatido',
      'pisoCimento', 'moradiaTijolo', 'moradiaTaipa', 'moradiaMadeira',
      'saneamentoFossa', 'saneamentoAguaEncanada', 'saneamentoEnergiaEletrica'
    ];
    
    // Nomes das colunas no banco (assumindo que são snake_case)
    const columns = [
        'child_name', 'birth_date', 'gender', 'race', 'sus_card', 'has_health_issues',
        'health_issues_description', 'has_government_aid', 'government_aid_description',
        'guardian_name', 'guardian_cpf', 'guardian_phone', 'guardian_workplace', 'guardian_rg',
        'address_street', 'address_number', 'address_neighborhood', 'address_city', 'address_state', 'address_cep',
        'birth_certificate_number', 'birth_certificate_city', 'birth_certificate_registry_office',
        'birth_certificate_registry_city', 'child_cpf', 'child_rg', 'child_rg_issue_date',
        'child_rg_issuing_authority',
        'casa_propria', 'casa_alugada', 'casa_cedida', 'piso_lajota', 'piso_chao_batido',
        'piso_cimento', 'moradia_tijolo', 'moradia_taipa', 'moradia_madeira',
        'saneamento_fossa', 'saneamento_agua_encanada', 'saneamento_energia_eletrica'
    ];

    // 4. Montar os valores e placeholders
    const values = [];
    const placeholders = [];
    let i = 1;

    // Constrói os arrays de colunas, valores e placeholders dinamicamente
    const queryColumns = [];
    columns.forEach((colName, index) => {
        const fieldName = fields[index];
        if (data[fieldName] !== undefined) {
            queryColumns.push(colName);
            values.push(data[fieldName] || null); // Trata campos vazios como nulos
            placeholders.push(`$${i}`);
            i++;
        }
    });

    if (values.length === 0) {
        return res.status(400).json({ error: "Nenhum dado válido foi enviado." });
    }

    // 5. Construir a Query Dinamicamente
    const query = `
      INSERT INTO pre_matriculas (${queryColumns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING id
    `;

    // 6. Executar a Query
    const result = await pool.query(query, values);

    // 7. Retornar sucesso
    return res.status(201).json({ success: true, newId: result.rows[0].id, protocol: `PROTOCOLO-${result.rows[0].id}` });

  } catch (error) {
    console.error("Erro ao salvar pré-matrícula:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;