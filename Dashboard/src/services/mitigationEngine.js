


export function getMitigationActions(sources) {
  const actions = {
    immediate: [],
    shortTerm: [],
    policy: []
  }

  if (sources.includes("Vehicular emissions")) {
    actions.immediate.push(
      "Restrict heavy vehicles during peak hours",
      "Deploy traffic police at congestion hotspots"
    )

    actions.policy.push(
      "Introduce low-emission traffic corridors",
      "Promote electric public transport"
    )
  }

  if (sources.includes("Road dust")) {
    actions.shortTerm.push(
      "Mechanical road sweeping",
      "Water spraying on major roads"
    )

    actions.policy.push(
      "Pave unsealed road shoulders"
    )
  }

  if (sources.includes("Construction activity")) {
    actions.immediate.push(
      "Enforce dust netting at construction sites"
    )

    actions.policy.push(
      "Mandatory on-site dust suppression norms"
    )
  }

  if (sources.includes("Biomass / waste burning")) {
    actions.immediate.push(
      "Ban open waste burning",
      "Increase enforcement patrols"
    )
  }

  return actions
}
