"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch as AnimatedSwitch } from "@/components/animate-ui/components/radix/switch";

export default function Home() {
  const [active, setActive] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-4xl w-full grid gap-8 md:grid-cols-2">
        {/* Standard Shadcn UI Component */}
        <Card>
          <CardHeader>
            <CardTitle>Standard Dashboard Component</CardTitle>
            <CardDescription>
              This is a standard Shadcn UI Card. It doesn't use heavy animations, ideal for static data density.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="h-24 rounded bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Dashboard Content</span>
            </div>
            <Button variant="default">Standard Button</Button>
          </CardContent>
        </Card>

        {/* Animate UI Component */}
        <Card>
          <CardHeader>
            <CardTitle>Animate UI Component</CardTitle>
            <CardDescription>
              This component is from Animate UI. It utilizes Framer Motion to provide a fluid, premium interaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[200px] gap-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Toggle Premium Feature</span>
              <AnimatedSwitch checked={active} onCheckedChange={setActive} />
            </div>
            <p className="text-sm text-muted-foreground">
              Feature is {active ? "Enabled" : "Disabled"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
