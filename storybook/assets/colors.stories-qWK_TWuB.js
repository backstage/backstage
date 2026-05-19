import{j as e,B as o,p as b}from"./iframe-BbcE2xlx.js";import{F as r}from"./Flex-BALgHQ7e.js";import{T as l}from"./Text-CajzVDHZ.js";import"./preload-helper-PPVm8Dsz.js";const t=b.meta({title:"Backstage UI/Colors",tags:["!manifest"]}),s=({label:i})=>e.jsx("div",{style:{backgroundColor:"var(--bui-bg-inherit)",padding:"0.5rem 0.75rem",borderRadius:"0.25rem",outline:"1px dashed var(--bui-fg-secondary)"},children:e.jsx(l,{children:i})}),n=t.story({render:()=>e.jsx("div",{style:{backgroundColor:"var(--bui-bg-app)"},children:e.jsxs(o,{p:"4",style:{backgroundColor:"var(--bui-bg-neutral-1)"},children:[e.jsxs(r,{direction:"row",gap:"4",align:"center",children:[e.jsx(l,{children:"Neutral 1"}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-1-hover)"},children:e.jsx(l,{children:"Hover"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-1-pressed)"},children:e.jsx(l,{children:"Pressed"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-1-disabled)"},children:e.jsx(l,{style:{color:"var(--bui-fg-disabled)"},children:"Disabled"})})]}),e.jsxs(o,{p:"4",mt:"4",style:{backgroundColor:"var(--bui-bg-neutral-2)"},children:[e.jsxs(r,{direction:"row",gap:"4",align:"center",children:[e.jsx(l,{children:"Neutral 2"}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-2-hover)"},children:e.jsx(l,{children:"Hover"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-2-pressed)"},children:e.jsx(l,{children:"Pressed"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-2-disabled)"},children:e.jsx(l,{style:{color:"var(--bui-fg-disabled)"},children:"Disabled"})})]}),e.jsxs(o,{p:"4",mt:"4",style:{backgroundColor:"var(--bui-bg-neutral-3)"},children:[e.jsxs(r,{direction:"row",gap:"4",align:"center",children:[e.jsx(l,{children:"Neutral 3"}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-3-hover)"},children:e.jsx(l,{children:"Hover"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-3-pressed)"},children:e.jsx(l,{children:"Pressed"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-3-disabled)"},children:e.jsx(l,{style:{color:"var(--bui-fg-disabled)"},children:"Disabled"})})]}),e.jsx(o,{p:"4",mt:"4",style:{backgroundColor:"var(--bui-bg-neutral-4)"},children:e.jsxs(r,{direction:"row",gap:"4",align:"center",children:[e.jsx(l,{children:"Neutral 4"}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-4-hover)"},children:e.jsx(l,{children:"Hover"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-4-pressed)"},children:e.jsx(l,{children:"Pressed"})}),e.jsx(r,{px:"2",py:"1",style:{backgroundColor:"var(--bui-bg-neutral-4-disabled)"},children:e.jsx(l,{style:{color:"var(--bui-fg-disabled)"},children:"Disabled"})})]})})]})]})]})})}),a=t.story({render:()=>e.jsxs(r,{direction:"column",gap:"4",children:[e.jsx(s,{label:"App level (no provider) — resolves to --bui-bg-app"}),e.jsx(o,{bg:"neutral",p:"4",children:e.jsxs(r,{direction:"column",gap:"3",children:[e.jsx(s,{label:"Inside neutral-1 — resolves to --bui-bg-neutral-1"}),e.jsx(o,{bg:"neutral",p:"4",children:e.jsxs(r,{direction:"column",gap:"3",children:[e.jsx(s,{label:"Inside neutral-2 — resolves to --bui-bg-neutral-2"}),e.jsx(o,{bg:"neutral",p:"4",children:e.jsx(s,{label:"Inside neutral-3 — resolves to --bui-bg-neutral-3"})})]})})]})}),e.jsx(o,{bg:"danger",p:"4",children:e.jsx(s,{label:"Inside danger — resolves to --bui-bg-danger"})}),e.jsx(o,{bg:"warning",p:"4",children:e.jsx(s,{label:"Inside warning — resolves to --bui-bg-warning"})}),e.jsx(o,{bg:"success",p:"4",children:e.jsx(s,{label:"Inside success — resolves to --bui-bg-success"})})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <div style={{
    backgroundColor: 'var(--bui-bg-app)'
  }}>
      <Box p="4" style={{
      backgroundColor: 'var(--bui-bg-neutral-1)'
    }}>
        <Flex direction="row" gap="4" align="center">
          <Text>Neutral 1</Text>
          <Flex px="2" py="1" style={{
          backgroundColor: 'var(--bui-bg-neutral-1-hover)'
        }}>
            <Text>Hover</Text>
          </Flex>
          <Flex px="2" py="1" style={{
          backgroundColor: 'var(--bui-bg-neutral-1-pressed)'
        }}>
            <Text>Pressed</Text>
          </Flex>
          <Flex px="2" py="1" style={{
          backgroundColor: 'var(--bui-bg-neutral-1-disabled)'
        }}>
            <Text style={{
            color: 'var(--bui-fg-disabled)'
          }}>Disabled</Text>
          </Flex>
        </Flex>
        <Box p="4" mt="4" style={{
        backgroundColor: 'var(--bui-bg-neutral-2)'
      }}>
          <Flex direction="row" gap="4" align="center">
            <Text>Neutral 2</Text>
            <Flex px="2" py="1" style={{
            backgroundColor: 'var(--bui-bg-neutral-2-hover)'
          }}>
              <Text>Hover</Text>
            </Flex>
            <Flex px="2" py="1" style={{
            backgroundColor: 'var(--bui-bg-neutral-2-pressed)'
          }}>
              <Text>Pressed</Text>
            </Flex>
            <Flex px="2" py="1" style={{
            backgroundColor: 'var(--bui-bg-neutral-2-disabled)'
          }}>
              <Text style={{
              color: 'var(--bui-fg-disabled)'
            }}>Disabled</Text>
            </Flex>
          </Flex>
          <Box p="4" mt="4" style={{
          backgroundColor: 'var(--bui-bg-neutral-3)'
        }}>
            <Flex direction="row" gap="4" align="center">
              <Text>Neutral 3</Text>
              <Flex px="2" py="1" style={{
              backgroundColor: 'var(--bui-bg-neutral-3-hover)'
            }}>
                <Text>Hover</Text>
              </Flex>
              <Flex px="2" py="1" style={{
              backgroundColor: 'var(--bui-bg-neutral-3-pressed)'
            }}>
                <Text>Pressed</Text>
              </Flex>
              <Flex px="2" py="1" style={{
              backgroundColor: 'var(--bui-bg-neutral-3-disabled)'
            }}>
                <Text style={{
                color: 'var(--bui-fg-disabled)'
              }}>
                  Disabled
                </Text>
              </Flex>
            </Flex>
            <Box p="4" mt="4" style={{
            backgroundColor: 'var(--bui-bg-neutral-4)'
          }}>
              <Flex direction="row" gap="4" align="center">
                <Text>Neutral 4</Text>
                <Flex px="2" py="1" style={{
                backgroundColor: 'var(--bui-bg-neutral-4-hover)'
              }}>
                  <Text>Hover</Text>
                </Flex>
                <Flex px="2" py="1" style={{
                backgroundColor: 'var(--bui-bg-neutral-4-pressed)'
              }}>
                  <Text>Pressed</Text>
                </Flex>
                <Flex px="2" py="1" style={{
                backgroundColor: 'var(--bui-bg-neutral-4-disabled)'
              }}>
                  <Text style={{
                  color: 'var(--bui-fg-disabled)'
                }}>
                    Disabled
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
})`,...n.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Probe label="App level (no provider) — resolves to --bui-bg-app" />

      <Box bg="neutral" p="4">
        <Flex direction="column" gap="3">
          <Probe label="Inside neutral-1 — resolves to --bui-bg-neutral-1" />
          <Box bg="neutral" p="4">
            <Flex direction="column" gap="3">
              <Probe label="Inside neutral-2 — resolves to --bui-bg-neutral-2" />
              <Box bg="neutral" p="4">
                <Probe label="Inside neutral-3 — resolves to --bui-bg-neutral-3" />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box bg="danger" p="4">
        <Probe label="Inside danger — resolves to --bui-bg-danger" />
      </Box>

      <Box bg="warning" p="4">
        <Probe label="Inside warning — resolves to --bui-bg-warning" />
      </Box>

      <Box bg="success" p="4">
        <Probe label="Inside success — resolves to --bui-bg-success" />
      </Box>
    </Flex>
})`,...a.input.parameters?.docs?.source}}};const g=["Default","BgInherit"];export{a as BgInherit,n as Default,g as __namedExportsOrder};
