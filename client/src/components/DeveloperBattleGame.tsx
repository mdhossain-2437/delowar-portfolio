import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/contexts/AchievementContext";

type BattleLog = {
  action: string;
  result: string;
};

export default function DeveloperBattleGame() {
  const [devHp, setDevHp] = useState(40);
  const [bugHp, setBugHp] = useState(30);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const { unlock, unlocked } = useAchievements();

  const addLog = (action: string, result: string) => {
    setLogs((prev) => [{ action, result }, ...prev].slice(0, 6));
  };

  const attack = () => {
    const damage = Math.ceil(Math.random() * 8 + 4);
    setBugHp((prev) => Math.max(0, prev - damage));
    addLog("Deploy Fix", `bug lost ${damage} stability`);
    bugTurn();
  };

  const defend = () => {
    const heal = Math.ceil(Math.random() * 4 + 2);
    setDevHp((prev) => Math.min(40, prev + heal));
    addLog("Write Test", `regained ${heal} focus`);
    bugTurn();
  };

  const bugTurn = () => {
    const damage = Math.ceil(Math.random() * 6 + 2);
    setDevHp((prev) => Math.max(0, prev - damage));
    addLog("Bug strikes", `developer lost ${damage} focus`);
  };

  const reset = () => {
    setDevHp(40);
    setBugHp(30);
    setLogs([]);
  };

  const victory = bugHp === 0;
  const defeat = devHp === 0;

  if (victory && !unlocked.has("bug-hunter")) {
    unlock("bug-hunter");
  }

  return (
    <section className="py-20 bg-card/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Developer battle
          </p>
          <h3 className="text-2xl font-semibold text-foreground">
            Turn-based bug smashing mini-game
          </h3>
        </div>
        <div className="rounded-3xl border border-border bg-background/80 p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <Stat label="Developer" hp={devHp} max={40} />
            <Stat label="Code Bug" hp={bugHp} max={30} />
          </div>
          <div className="flex gap-3">
            <Button onClick={attack} disabled={victory || defeat}>
              Deploy fix
            </Button>
            <Button variant="outline" onClick={defend} disabled={victory || defeat}>
              Write test
            </Button>
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
          </div>
          {victory && <p className="text-emerald-400 text-sm">You crushed the bug! 🐛</p>}
          {defeat && <p className="text-red-400 text-sm">Bug overwhelmed the sprint…</p>}
          <div className="border border-border rounded-2xl p-3 h-32 overflow-auto text-xs space-y-1">
            {logs.map((log, index) => (
              <p key={index}>
                <strong>{log.action}:</strong> {log.result}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, hp, max }: { label: string; hp: number; max: number }) {
  const percentage = (hp / max) * 100;
  return (
    <div className="flex-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>
          {hp}/{max} HP
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
