import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const p = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src/app/dashboard/appointments/page.tsx');
let s = fs.readFileSync(p, 'utf8');

const old = `                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))`;

const neu = `                    </button>
                  </motion.div>
                </motion.div>
                </motion.div>
                {appt.status === 'COMPLETED' && (
                  <AppointmentReviewForm appointmentId={appt.id} />
                )}
              </motion.div>
            ))`;

if (!s.includes(old)) {
  const old2 = `                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))`;
  if (s.includes(old2)) {
    s = s.replace(old2, neu);
  } else {
    console.log('not found');
    process.exit(1);
  }
} else {
  s = s.replace(old, neu);
}

fs.writeFileSync(p, s);
console.log('patched');
