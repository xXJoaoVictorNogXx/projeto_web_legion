const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Função auxiliar para converter snake_case para camelCase (para os GETs)
const toCamelCase = (data) => {
  if (Array.isArray(data)) return data.map(item => toCamelCase(item));
  if (data !== null && typeof data === 'object') {
    const newObj = {};
    Object.keys(data).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      newObj[camelKey] = data[key];
    });
    return newObj;
  }
  return data;
};

// POST: Criar Nova Pré-Matrícula
router.post('/pre-matricula', async (req, res) => {
  try {
    const data = req.body;

    // Validação básica
    if (!data.childName || !data.guardianName || !data.guardianCpf) {
      return res.status(400).json({ error: "Nome da criança, nome do responsável e CPF do responsável são obrigatórios." });
    }

    // Array FIELDS: Nomes que vêm do Frontend (camelCase)
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

    // Array COLUMNS: Nomes no Banco de Dados (snake_case)
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

    // Array BOOLEANOS: Nomes no Banco de Dados (snake_case) para verificação
    const booleanColumns = [
        'casa_propria', 'casa_alugada', 'casa_cedida', 'piso_lajota', 'piso_chao_batido',
        'piso_cimento', 'moradia_tijolo', 'moradia_taipa', 'moradia_madeira',
        'saneamento_fossa', 'saneamento_agua_encanada', 'saneamento_energia_eletrica',
        'has_health_issues', 'has_government_aid'
    ];

    const values = [];
    const placeholders = [];
    const queryColumns = [];
    let i = 1;

    // Loop de Construção da Query
    columns.forEach((colName, index) => {
      const fieldName = fields[index]; // Pega o nome camelCase correspondente
      let value = data[fieldName];     // Pega o valor enviado pelo front

      // Tratamento Especial para Booleanos
      if (booleanColumns.includes(colName)) {
         // Se for booleano, força true ou false (nunca null)
         values.push(!!value);
      } else {
         // Se for outro tipo, aceita o valor ou null
         values.push(value || null);
      }

      queryColumns.push(colName);
      placeholders.push(`$${i}`);
      i++;
    });

    const query = `
      INSERT INTO pre_matriculas (${queryColumns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING id
    `;

    const result = await pool.query(query, values);

    return res.status(201).json({ 
        success: true, 
        newId: result.rows[0].id, 
        protocol: `PROTOCOLO-${result.rows[0].id}` 
    });

  } catch (error) {
    console.error("Erro ao salvar pré-matrícula:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/pre-matriculas', async (_req, res) => {
  try {
    // 1. Selecionamos as colunas usando o nome real no banco (snake_case)
    const { rows } = await pool.query(
      `SELECT 
         id, status, child_name, birth_date, gender, race, 
         guardian_name, guardian_cpf, guardian_phone
       FROM pre_matriculas ORDER BY child_name`
    );

    // 2. Usamos a função auxiliar para converter tudo para camelCase
    // O frontend vai receber: { childName: "...", guardianName: "..." }
    res.json(toCamelCase(rows)); 

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET: Buscar LISTA de pré-matrículas por Status (Para a tela de Listagem)
router.get('/pre-matricula/status/:status', async (req, res) => {
  try {
    const { status } = req.params; 
    
    const { rows } = await pool.query(
      // Seleciona em snake_case (nativo do banco)
      "SELECT id, child_name, guardian_name, created_at, status FROM pre_matriculas WHERE status = $1 ORDER BY created_at DESC", 
      [status.toUpperCase()] 
    );

    // Retorna a lista (Array) convertida para camelCase
    res.json(toCamelCase(rows)); 
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT: Aprovar Pré-Matrícula
router.put('/pre-matriculas/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      "UPDATE pre_matriculas SET status = 'APROVADO' WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Pré-matrícula não encontrada." });
    }

    res.json({ message: "Matrícula aprovada com sucesso!" });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;