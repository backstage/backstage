import{j as e}from"./iframe-hvh2aMf9.js";import{C as t}from"./Collapsible-5_FzU2g7.js";import{B as l}from"./Button-Ba8Zo8kH.js";import{B as p}from"./Box-DekGcCN6.js";import{T as a}from"./Text-1jxKsdSh.js";import{I as n}from"./provider-LAiWxmQL.js";import"./preload-helper-D9Z9MdNV.js";import"./clsx-B-dksMZM.js";import"./useStyles-BvFuW9vi.js";import"./useBaseUiId-BdCqdMBw.js";import"./Button-D-c0dF0y.js";import"./utils-A5eb8iUx.js";import"./Hidden-xm9ynEG8.js";import"./useFocusRing-LjJUE2Ue.js";import"./usePress-85033q8V.js";import"./spacing.props-m9PQeFPu.js";const w={title:"Backstage UI/Collapsible",component:t.Root},r={args:{style:{display:"flex",flexDirection:"column",gap:"var(--bui-space-2)",alignItems:"center"},children:e.jsxs(e.Fragment,{children:[e.jsx(t.Trigger,{render:(i,s)=>e.jsx(l,{variant:"secondary",iconEnd:s.open?e.jsx(n,{name:"chevron-up"}):e.jsx(n,{name:"chevron-down"}),...i,children:s.open?"Close Panel":"Open Panel"})}),e.jsx(t.Panel,{children:e.jsxs(p,{p:"4",style:{border:"1px solid var(--bui-border)",backgroundColor:"var(--bui-bg-surface-1)",color:"var(--bui-fg-primary)",borderRadius:"var(--bui-radius-2)",width:"460px"},children:[e.jsx(a,{children:"It's the edge of the world and all of Western civilization"}),e.jsx(a,{children:"The sun may rise in the East, at least it settled in a final location"}),e.jsx(a,{children:"It's understood that Hollywood sells Californication"})]})})]})}},o={args:{...r.args,defaultOpen:!0}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--bui-space-2)',
      alignItems: 'center'
    },
    children: <>
        <Collapsible.Trigger render={(props, state) => <Button variant="secondary" iconEnd={state.open ? <Icon name="chevron-up" /> : <Icon name="chevron-down" />} {...props}>
              {state.open ? 'Close Panel' : 'Open Panel'}
            </Button>} />
        <Collapsible.Panel>
          <Box p="4" style={{
          border: '1px solid var(--bui-border)',
          backgroundColor: 'var(--bui-bg-surface-1)',
          color: 'var(--bui-fg-primary)',
          borderRadius: 'var(--bui-radius-2)',
          width: '460px'
        }}>
            <Text>
              It's the edge of the world and all of Western civilization
            </Text>
            <Text>
              The sun may rise in the East, at least it settled in a final
              location
            </Text>
            <Text>It's understood that Hollywood sells Californication</Text>
          </Box>
        </Collapsible.Panel>
      </>
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultOpen: true
  }
}`,...o.parameters?.docs?.source}}};const O=["Default","Open"];export{r as Default,o as Open,O as __namedExportsOrder,w as default};
