import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingProgram } from '../../services/api';
import { Button } from '../atoms/Button';

interface TrainingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: TrainingProgram | null;
  onEnroll: (program: TrainingProgram) => void;
}

/**
 * Modal component for displaying detailed training program information
 * 
 * @component
 * @param {TrainingDetailsModalProps} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {TrainingProgram | null} props.program - Training program data to display
 * @param {Function} props.onEnroll - Callback when user wants to enroll in the program
 * 
 * @example
 * ```tsx
 * <TrainingDetailsModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   program={selectedProgram}
 *   onEnroll={handleEnrollment}
 * />
 * ```
 */
export const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({
  isOpen,
  onClose,
  program,
  onEnroll,
}) => {
  if (!program) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              aria-label="关闭"
            >
              <svg
                className="w-5 h-5 text-neutral-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-8">
              <h2 className="text-3xl font-bold mb-2">{program.title}</h2>
              <div className="flex flex-wrap gap-4 text-white/90">
                <span className="flex items-center gap-2">
                  <span>🕑</span>
                  <span>{program.duration}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>🎓</span>
                  <span>
                    {program.level === 'beginner' ? '初级' : 
                     program.level === 'intermediate' ? '中级' : '高级'}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span>💰</span>
                  <span className="font-bold">¥{program.price}</span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Description */}
              <section>
                <h3 className="text-xl font-bold text-yes-dark mb-4">课程介绍</h3>
                <p className="text-gray-600 leading-relaxed">{program.description}</p>
              </section>

              {/* Features */}
              {program.features && program.features.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-yes-dark mb-4">课程特色</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-yes-green text-xl">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Modules */}
              {program.modules && program.modules.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-yes-dark mb-4">课程模块</h3>
                  <div className="space-y-3">
                    {program.modules.map((module, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-yes-green text-white rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-700">{module}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {program.requirements && program.requirements.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-yes-dark mb-4">学习要求</h3>
                  <ul className="space-y-2">
                    {program.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-yes-green">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Certification */}
              {program.certification && (
                <section className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-xl font-bold text-yes-dark mb-3 flex items-center gap-2">
                    <span>🏆</span>
                    认证证书
                  </h3>
                  <p className="text-gray-700">
                    完成本课程并通过考核后，将获得耶氏体育官方认证证书，证书在业内广泛认可。
                  </p>
                </section>
              )}

              {/* Schedule */}
              {program.schedule && (
                <section>
                  <h3 className="text-xl font-bold text-yes-dark mb-4">课程安排</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    {typeof program.schedule === 'string' ? (
                      <p className="text-gray-700 whitespace-pre-line">{program.schedule}</p>
                    ) : (
                      <div className="space-y-3">
                        {program.schedule.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <span className="inline-block w-8 h-8 bg-yes-green text-white rounded-full text-center leading-8 text-sm font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{item.date} {item.time}</p>
                              <p className="text-gray-600">{item.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    onEnroll(program);
                    onClose();
                  }}
                  className="flex-1 md:flex-initial"
                >
                  立即报名
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                  className="flex-1 md:flex-initial"
                >
                  关闭
                </Button>
              </div>

              {/* Contact Info */}
              <div className="text-center text-gray-600 pt-4">
                <p className="mb-2">如有疑问，请联系我们</p>
                <p className="text-2xl font-bold text-yes-green">177-8714-7147</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};