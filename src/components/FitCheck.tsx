import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FitCheckAnswers, FitCheckConfig, FitCheckOption, FitCheckQuestion } from '../content/fitCheckConfigs';

type FitCheckProps = {
  config: FitCheckConfig;
};

const isOptionSelected = (answers: FitCheckAnswers, question: FitCheckQuestion, option: FitCheckOption) => {
  const answer = answers[question.id];
  if (question.type === 'single') {
    return answer === option.value;
  }
  return Array.isArray(answer) && answer.includes(option.value);
};

const FitCheck = ({ config }: FitCheckProps) => {
  const [answers, setAnswers] = useState<FitCheckAnswers>({});
  const [showRecommendation, setShowRecommendation] = useState(false);

  const requiredQuestions = useMemo(() => config.questions.filter((question) => question.required !== false), [config.questions]);
  const answeredCount = useMemo(
    () =>
      requiredQuestions.filter((question) => {
        const answer = answers[question.id];
        return question.type === 'single'
          ? typeof answer === 'string' && answer.length > 0
          : Array.isArray(answer) && answer.length > 0;
      }).length,
    [answers, requiredQuestions],
  );

  const allRequiredAnswered = answeredCount === requiredQuestions.length;

  const recommendation = useMemo(() => {
    if (!showRecommendation || !allRequiredAnswered) {
      return null;
    }
    return config.getRecommendation(answers);
  }, [allRequiredAnswered, answers, config, showRecommendation]);

  const hasUncertainSelection = useMemo(
    () =>
      config.questions.some((question) =>
        question.options.some((option) => option.uncertain && isOptionSelected(answers, question, option)),
      ),
    [answers, config.questions],
  );

  const handleSingleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (question: FitCheckQuestion, option: FitCheckOption) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[question.id]) ? prev[question.id] : [];
      const isSelected = current.includes(option.value);

      if (isSelected) {
        return { ...prev, [question.id]: current.filter((item) => item !== option.value) };
      }

      if (question.limit && current.length >= question.limit) {
        return prev;
      }

      if (option.exclusive) {
        return { ...prev, [question.id]: [option.value] };
      }

      const next = current.filter((item) => {
        const optionMatch = question.options.find((opt) => opt.value === item);
        return !optionMatch?.exclusive;
      });

      return { ...prev, [question.id]: [...next, option.value] };
    });
  };

  const handleStartOver = () => {
    setAnswers({});
    setShowRecommendation(false);
  };

  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Fit Check</div>
          <h1 style={{ margin: 0 }}>{config.heroTitle}</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>{config.heroSubtitle}</p>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {config.questions.map((question, index) => (
            <div className="card" key={question.id} style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0 }}>
                    {`Question ${index + 1}`}
                  </h3>
                  {question.limit && <span className="badge">Pick up to {question.limit}</span>}
                </div>
                <p style={{ margin: 0, color: '#c8c0aa' }}>{question.prompt}</p>
                {question.helper && <small style={{ color: '#9fb3c8' }}>{question.helper}</small>}
              </div>

              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {question.options.map((option) => {
                  const selected = isOptionSelected(answers, question, option);
                  const currentSelections = Array.isArray(answers[question.id]) ? answers[question.id] : [];
                  const atLimit = question.limit ? currentSelections.length >= question.limit : false;
                  const isDisabled = question.type === 'multi' && question.limit && atLimit && !selected;
                  return (
                    <label
                      key={option.value}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: '0.75rem',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        borderRadius: '16px',
                        border: selected ? '1px solid rgba(120, 203, 255, 0.7)' : '1px solid rgba(148, 163, 184, 0.2)',
                        background: selected ? 'rgba(24, 36, 55, 0.8)' : 'rgba(9, 15, 25, 0.65)',
                        opacity: isDisabled ? 0.55 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <input
                        type={question.type === 'single' ? 'radio' : 'checkbox'}
                        name={question.id}
                        value={option.value}
                        checked={selected}
                        disabled={isDisabled}
                        onChange={() =>
                          question.type === 'single' ? handleSingleSelect(question.id, option.value) : handleMultiSelect(question, option)
                        }
                        style={{ accentColor: 'rgb(120, 203, 255)' }}
                      />
                      <div style={{ display: 'grid', gap: '0.2rem' }}>
                        <span style={{ color: '#fef7e5', fontWeight: 600 }}>{option.label}</span>
                        {option.helper && <small style={{ color: '#9fb3c8' }}>{option.helper}</small>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: 'sticky', bottom: '1.5rem', zIndex: 2 }}>
          <div
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              padding: '1rem 1.25rem',
            }}
          >
            <div style={{ display: 'grid', gap: '0.35rem' }}>
              <strong style={{ color: '#fff7e6' }}>Ready for your recommendation?</strong>
              <small style={{ color: allRequiredAnswered ? '#c8c0aa' : '#f0b267' }}>
                {allRequiredAnswered
                  ? 'All questions answered.'
                  : `Answer ${requiredQuestions.length - answeredCount} more question${requiredQuestions.length - answeredCount === 1 ? '' : 's'} to continue.`}
              </small>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn"
                disabled={!allRequiredAnswered}
                onClick={() => setShowRecommendation(true)}
              >
                Show recommendation
              </button>
              <button type="button" className="btn btn-link" onClick={handleStartOver}>
                Start over
              </button>
            </div>
          </div>
        </div>

        {recommendation && (
          <div className="card" style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="badge">Recommendation</div>
              <h2 style={{ margin: 0 }}>{`Recommended: ${config.tiers[recommendation.tier].label}`}</h2>
            </div>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              <strong style={{ color: '#fef7e5' }}>Based on:</strong> {recommendation.basedOn}.
            </p>

            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>Why this fits</h3>
                <ul className="list" style={{ margin: 0 }}>
                  {recommendation.why.map((reason) => (
                    <li key={reason}>
                      <span />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>Included in this tier</h3>
                <ul className="list" style={{ margin: 0 }}>
                  {config.tiers[recommendation.tier].included.map((item) => (
                    <li key={item}>
                      <span />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {(recommendation.tier === 'bronze' || hasUncertainSelection) && (
              <div style={{ display: 'grid', gap: '0.3rem', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(20, 32, 50, 0.7)' }}>
                <strong style={{ color: '#fef7e5' }}>Not sure? Choose Silver.</strong>
                <small style={{ color: '#c8c0aa' }}>Silver keeps the plan balanced without overcommitting to full coverage.</small>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {config.ctas.map((cta) => {
                const className = cta.variant === 'secondary' ? 'btn btn-secondary' : cta.variant === 'link' ? 'btn btn-link' : 'btn';
                return (
                  <Link key={cta.label} className={className} to={cta.to}>
                    {cta.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FitCheck;
