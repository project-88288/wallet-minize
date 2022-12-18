import { Proposal } from "@terra-money/terra.js"
import { FinderLink } from "components/general"
import { Col, Card } from "components/layout"
import { Read } from "components/token"
import { useIsClassic } from "data/query"
import DataList from "./components/DataList"

const ProposalSummary = ({ proposal }: { proposal: Proposal }) => {
  const isClassic = useIsClassic()
  const contentData = proposal.content.toData(isClassic)
  const details = Object.entries(contentData)
    .filter(([key]) => !["@type", "title", "description"].includes(key))
    .map(([key, content]) => ({
      title: capitalize(key),
      content:
        key === "amount" ? (
          content.map((coin: CoinData) => <Read {...coin} key={coin.denom} />)
        ) : key === "recipient" ? (
          <FinderLink short>{content}</FinderLink>
        ) : key === "changes" ? (
          content.map((item: object, index: number) => (
            <pre key={index}>{stringify(item)}</pre>
          ))
        ) : (
          <pre>{stringify(content)}</pre>
        ),
    }))

  return !details.length ? null : (
    <Col>
      <Card>
        <DataList list={details} type="vertical" />
      </Card>
    </Col>
  )
}

export default ProposalSummary

/* helpers */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const stringify = (value: string | object) =>
  typeof value !== "string" ? JSON.stringify(value, null, 2) : value
