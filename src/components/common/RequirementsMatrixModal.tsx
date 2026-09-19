import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Users, Layers, ExternalLink, Calendar, Scissors, HelpCircle } from 'lucide-react';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

interface RequirementsMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchRoleAndTab: (role: UserRole, tab: string) => void;
}

export const RequirementsMatrixModal: React.FC<RequirementsMatrixModalProps> = ({
  isOpen,
  onClose,
  onSwitchRoleAndTab
}) => {
  const { users, services, appointments } = useApp();
  const [activeTab, setActiveTab] = useState<'diagram' | 'rf' | 'rnf'>('diagram');

  if (!isOpen) return null;

  const functionalRequirements = [
    {
      id: 'RF-01',
      title: 'Criar conta de cliente',
      actor: 'Cliente',
      priority: 'M',
      desc: 'O sistema deve permitir que o visitante crie sua conta com email, telefone, nome completo e senha.',
      testAction: () => onSwitchRoleAndTab('cliente', 'agendar')
    },
    {
      id: 'RF-02',
      title: 'Redefinir senha',
      actor: 'Cliente, Recepcionista, Barbeiro, Administrador',
      priority: 'M',
      desc: 'Redefinição através de envio de link de recuperação por e-mail cadastrado ou telefone.',
      testAction: () => onSwitchRoleAndTab('cliente', 'agendar')
    },
    {
      id: 'RF-03',
      title: 'Autenticar Usuário',
      actor: 'Cliente, Recepcionista, Barbeiro, Administrador',
      priority: 'M',
      desc: 'Permitir acesso através do preenchimento correto de e-mail e senha.',
      testAction: () => onSwitchRoleAndTab('cliente', 'agendar')
    },
    {
      id: 'RF-04',
      title: 'Agendar Serviço',
      actor: 'Cliente',
      priority: 'M',
      desc: 'Cliente autenticado agenda serviços selecionando o horário e profissional com disponibilidade.',
      testAction: () => onSwitchRoleAndTab('cliente', 'agendar')
    },
    {
      id: 'RF-05',
      title: 'Consultar disponibilidade',
      actor: 'Cliente',
      priority: 'M',
      desc: 'Cards dos serviços com nome, descrição, preço e duração; calendário com horários disponíveis em tempo real sem conflitos; fotos e nomes dos profissionais.',
      testAction: () => onSwitchRoleAndTab('cliente', 'agendar')
    },
    {
      id: 'RF-06',
      title: 'Cadastrar barbeiro',
      actor: 'Administrador',
      priority: 'M',
      desc: 'Cadastro com nome, e-mail, bio, serviços aptos e envio de link de primeiro acesso seguro para o profissional criar sua própria senha.',
      testAction: () => onSwitchRoleAndTab('administrador', 'admin-barbeiros')
    },
    {
      id: 'RF-07',
      title: 'Cadastrar recepcionista',
      actor: 'Administrador',
      priority: 'M',
      desc: 'Cadastro com nome, email, telefone e link de primeiro acesso seguro para criação de senha.',
      testAction: () => onSwitchRoleAndTab('administrador', 'admin-recepcao')
    },
    {
      id: 'RF-08',
      title: 'Cadastrar serviços',
      actor: 'Administrador',
      priority: 'M',
      desc: 'Cadastro de serviços com nome, descrição, preço, duração e associação de barbeiros aptos.',
      testAction: () => onSwitchRoleAndTab('administrador', 'admin-servicos')
    },
    {
      id: 'RF-09',
      title: 'Exibir Agendamentos Realizados',
      actor: 'Cliente',
      priority: 'S',
      desc: 'Listagem dos agendamentos realizados do cliente com data, horário, barbeiro e serviço.',
      testAction: () => onSwitchRoleAndTab('cliente', 'meus-agendamentos')
    },
    {
      id: 'RF-10',
      title: 'Cancelar agendamento',
      actor: 'Cliente, Recepcionista',
      priority: 'M',
      desc: 'Cancelamento a qualquer momento mediante preenchimento obrigatório do motivo.',
      testAction: () => onSwitchRoleAndTab('cliente', 'meus-agendamentos')
    },
    {
      id: 'RF-11',
      title: 'Cancelar automaticamente após a tolerância',
      actor: 'Sistema / Recepcionista',
      priority: 'S',
      desc: 'Cancelamento automático ou manual quando cliente ultrapassa a tolerância contratada (NAO_COMPARECEU).',
      testAction: () => onSwitchRoleAndTab('recepcionista', 'recepcao')
    },
    {
      id: 'RF-12',
      title: 'Cancelar em lote',
      actor: 'Recepcionista',
      priority: 'C',
      desc: 'Cancelamento em lote de agendamentos futuros de um profissional para um período com motivo registrado e notificações automáticas aos clientes.',
      testAction: () => onSwitchRoleAndTab('recepcionista', 'recepcao-lote')
    },
    {
      id: 'RF-13',
      title: 'Reagendar',
      actor: 'Cliente, Recepcionista',
      priority: 'C',
      desc: 'Reagendamento a qualquer momento solicitando motivo e novo horário disponível.',
      testAction: () => onSwitchRoleAndTab('cliente', 'meus-agendamentos')
    },
    {
      id: 'RF-14',
      title: 'Confirmar presença',
      actor: 'Recepcionista',
      priority: 'M',
      desc: 'Recepcionista confirma a chegada do cliente, alterando status para CONFIRMADO.',
      testAction: () => onSwitchRoleAndTab('recepcionista', 'recepcao')
    },
    {
      id: 'RF-15',
      title: 'Registrar Pagamento',
      actor: 'Recepcionista',
      priority: 'M',
      desc: 'Registro do pagamento após serviço realizado (PIX, Dinheiro, Cartão), alterando status para PAGO.',
      testAction: () => onSwitchRoleAndTab('recepcionista', 'recepcao')
    },
    {
      id: 'RF-16',
      title: 'Finalizar atendimento',
      actor: 'Barbeiro',
      priority: 'M',
      desc: 'Barbeiro marca serviço como concluído (REALIZADO), liberando a recepcionista para o pagamento.',
      testAction: () => onSwitchRoleAndTab('barbeiro', 'agenda-barbeiro')
    },
    {
      id: 'RF-17',
      title: 'Definir horários de trabalho',
      actor: 'Administrador',
      priority: 'M',
      desc: 'Definição da jornada de trabalho de cada barbeiro (dias, turnos e intervalo de almoço).',
      testAction: () => onSwitchRoleAndTab('administrador', 'admin-barbeiros')
    },
    {
      id: 'RF-18',
      title: 'Consultar agenda do dia',
      actor: 'Barbeiro',
      priority: 'M',
      desc: 'Acompanhamento da agenda no dia selecionado com horários marcados e disponíveis.',
      testAction: () => onSwitchRoleAndTab('barbeiro', 'agenda-barbeiro')
    },
    {
      id: 'RF-19',
      title: 'Notificar alterações no agendamento',
      actor: 'Sistema',
      priority: 'S',
      desc: 'Notificações por SMS e E-mail sempre que um agendamento for criado, cancelado ou reagendado.',
      testAction: () => onSwitchRoleAndTab('cliente', 'agendar')
    }
  ];

  const nonFunctionalRequirements = [
    {
      id: 'RNF-01',
      title: 'Tempo de resposta da consulta de disponibilidade',
      cat: 'Desempenho',
      spec: 'Cálculo de slots livres em menos de 2 segundos para 30 dias e até 10 barbeiros.',
      status: 'Implementado com algoritmo instantâneo em memória local'
    },
    {
      id: 'RNF-02',
      title: 'Integridade da agenda sob concorrência',
      cat: 'Confiabilidade',
      spec: 'Impedir dois agendamentos ativos para o mesmo profissional em horários sobrepostos.',
      status: 'Verificação em tempo real antes de criar/reagendar agendamento'
    },
    {
      id: 'RNF-03',
      title: 'Armazenamento de senhas',
      cat: 'Segurança',
      spec: 'Armazenamento seguro, links de primeiro acesso confidenciais sem revelação ao admin.',
      status: 'Links de primeiro acesso gerados e isolamento de credenciais'
    },
    {
      id: 'RNF-04',
      title: 'Controle de acesso por perfil',
      cat: 'Segurança',
      spec: 'Validação de permissões: Cliente, Recepcionista, Barbeiro e Administrador.',
      status: 'Navegação e ações condicionadas ao perfil logado com troca rápida de ator'
    },
    {
      id: 'RNF-05',
      title: 'Responsividade',
      cat: 'Usabilidade',
      spec: 'Design adaptativo a partir de 360px de largura sem rolagem horizontal.',
      status: 'Layout mobile-first 100% responsivo com Tailwind'
    },
    {
      id: 'RNF-06',
      title: 'Agendamento em poucos passos',
      cat: 'Usabilidade',
      spec: 'Cliente conclui agendamento em no máximo 4 telas e menos de 2 minutos.',
      status: 'Wizard de 4 etapas intuitivo (Serviço → Barbeiro → Data/Hora → Confirmação)'
    },
    {
      id: 'RNF-07',
      title: 'Disponibilidade contínua',
      cat: 'Disponibilidade',
      spec: 'Operação ininterrupta com persistência em localStorage.',
      status: 'Persistência contínua com suporte a restauração de dados demo'
    },
    {
      id: 'RNF-08',
      title: 'Impedir conflito de sobreposição',
      cat: 'Confiabilidade',
      spec: 'Impedir sobreposição considerando a duração exata do serviço selecionado.',
      status: 'Algoritmo de cálculo de intervalo [início, início + duração] checado contra a grade'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl animate-in zoom-in-95 my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                Especificação IEEE 830-1998
              </span>
              <h3 className="font-bold text-lg text-stone-100">
                Diagrama de Casos de Uso & Matriz de Requisitos
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Rastreabilidade completa de todos os 19 Requisitos Funcionais e 8 Não Funcionais
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'diagram' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Diagrama de Casos de Uso & Ciclo de Vida
          </button>
          <button
            onClick={() => setActiveTab('rf')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'rf' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Requisitos Funcionais (RF-01 a RF-19)
          </button>
          <button
            onClick={() => setActiveTab('rnf')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'rnf' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Requisitos Não Funcionais (RNF-01 a RNF-08)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* TAB 1: DIAGRAM & LIFECYCLE */}
          {activeTab === 'diagram' && (
            <div className="space-y-6 text-xs">
              {/* Lifecycle flow */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                <h4 className="font-bold text-sm text-stone-200 mb-2">
                  Ciclo de Vida do Agendamento (Documento de Requisitos)
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    1. AGENDADO
                  </span>
                  <span className="text-stone-500 font-bold">→</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    2. CONFIRMADO (Presença)
                  </span>
                  <span className="text-stone-500 font-bold">→</span>
                  <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                    3. REALIZADO (Serviço concluído)
                  </span>
                  <span className="text-stone-500 font-bold">→</span>
                  <span className="px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    4. PAGO
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-800/80 text-stone-400">
                  <strong className="text-rose-400">Estados Terminais Alternativos:</strong> CANCELADO (com motivo obrigatório pelo Cliente ou Recepcionista) e NAO_COMPARECEU (tolerância expirada).
                </div>
              </div>

              {/* Actors & Use Cases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-stone-100 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Ator: Cliente
                    </h5>
                    <button
                      onClick={() => onSwitchRoleAndTab('cliente', 'agendar')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      Testar Visão →
                    </button>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-400">
                    <li>Criar conta (RF-01) e Autenticar (RF-03)</li>
                    <li>Agendar serviço &lt;&lt;include&gt;&gt; Consultar disponibilidade (RF-04, RF-05)</li>
                    <li>Consultar agendamentos (RF-09)</li>
                    <li>Cancelar agendamento &lt;&lt;include&gt;&gt; Consultar agendamentos (RF-10)</li>
                    <li>Reagendar agendamento (RF-13)</li>
                  </ul>
                </div>

                {/* Recepcionista */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-stone-100 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-400" />
                      Ator: Recepcionista
                    </h5>
                    <button
                      onClick={() => onSwitchRoleAndTab('recepcionista', 'recepcao')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      Testar Visão →
                    </button>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-400">
                    <li>Confirmar presença do cliente (RF-14)</li>
                    <li>Registrar pagamento após atendimento (RF-15)</li>
                    <li>Cancelar agendamento individual (RF-10)</li>
                    <li>Cancelar agendamento em lote com motivo (RF-12)</li>
                    <li>Reagendar cliente (RF-13)</li>
                    <li>Marcar Não Compareceu / Tolerância (RF-11)</li>
                  </ul>
                </div>

                {/* Barbeiro */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-stone-100 flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-sky-400" />
                      Ator: Barbeiro
                    </h5>
                    <button
                      onClick={() => onSwitchRoleAndTab('barbeiro', 'agenda-barbeiro')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      Testar Visão →
                    </button>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-400">
                    <li>Consultar disponibilidade / agenda do dia (RF-18)</li>
                    <li>Finalizar atendimento (RF-16) liberando para recepção</li>
                  </ul>
                </div>

                {/* Administrador */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-stone-100 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-rose-400" />
                      Ator: Administrador
                    </h5>
                    <button
                      onClick={() => onSwitchRoleAndTab('administrador', 'admin-servicos')}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      Testar Visão →
                    </button>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-400">
                    <li>Cadastrar barbeiro com link de primeiro acesso (RF-06)</li>
                    <li>Cadastrar recepcionista com link de primeiro acesso (RF-07)</li>
                    <li>Cadastrar serviços com duração e barbeiros aptos (RF-08)</li>
                    <li>Definir horários de trabalho e tolerância (RF-17)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUISITOS FUNCIONAIS (RF-01 a RF-19) */}
          {activeTab === 'rf' && (
            <div className="space-y-2.5 text-xs">
              {functionalRequirements.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400 font-mono">{req.id}</span>
                      <span className="font-bold text-stone-100">{req.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 border border-stone-700">
                        Ator: {req.actor}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Prioridade: {req.priority}
                      </span>
                    </div>
                    <p className="text-stone-400 text-[11px] leading-relaxed">{req.desc}</p>
                  </div>

                  <button
                    onClick={() => {
                      req.testAction();
                      onClose();
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 font-bold text-[10px] transition-all flex items-center gap-1"
                  >
                    Testar
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REQUISITOS NÃO FUNCIONAIS (RNF-01 a RNF-08) */}
          {activeTab === 'rnf' && (
            <div className="space-y-2.5 text-xs">
              {nonFunctionalRequirements.map((rnf) => (
                <div
                  key={rnf.id}
                  className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-amber-400 font-mono">{rnf.id}</span>
                      <span className="font-bold text-stone-100">{rnf.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                        {rnf.cat}
                      </span>
                    </div>
                    <p className="text-stone-400 text-[11px]">{rnf.spec}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {rnf.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all"
          >
            Entendido, Voltar ao Sistema
          </button>
        </div>
      </div>
    </div>
  );
};
