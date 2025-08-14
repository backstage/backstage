import{j as e}from"./jsx-runtime-hv06LKfz.js";import{M as n}from"./TablePagination-UuIaJRQ_.js";import{I as m}from"./provider-DntK2tr9.js";import"./Box-bdFYA742.js";import"./Grid-DgCUMUxY.js";import{F as p}from"./Flex-Co3-3Y6W.js";import"./Container-CsYEARq4.js";import{B as c}from"./Button-Bf122Ew1.js";import"./Collapsible-oCQaOc00.js";import"./FieldLabel-DfCfC9HW.js";import"./ButtonIcon-BSgtwn5y.js";import"./ButtonLink-D-XuerfG.js";import"./RadioGroup-DJVJaaw3.js";import{r as M}from"./index-D8-PC79C.js";import"./Tabs-C7OZlfRT.js";import{T as g}from"./Text-B-YcxuAG.js";import"./TextField-CZ7wTdPc.js";import"./Tooltip-BVBepQan.js";import"./ScrollArea-ngUsS74r.js";import"./SearchField-sy3UtP8m.js";import"./Link-DatNe69X.js";import"./Select-CgIMwJnh.js";import"./Skeleton-BIVtobe8.js";import"./Switch-Bbj9mDjK.js";import"./clsx-B-dksMZM.js";import"./useStyles-BSSAtcKC.js";import"./useBaseUiId-D_SK3tu4.js";import"./Link-B4jsamBv.js";import"./utils-SVxEJA3c.js";import"./useFocusRing-BDW1BQ1a.js";import"./usePress-CG1fvX6x.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./Button-BVmmXt8z.js";import"./Hidden-Bl3CD3Sw.js";import"./Collection-CrXXjB02.js";import"./FocusScope-1Zfm8FiP.js";import"./context-C8UuisDZ.js";import"./useControlledState-hFzvQclK.js";import"./useLocalizedStringFormatter-Di64h_0G.js";import"./VisuallyHidden-BQdEkh9J.js";import"./FieldError-DnfqdXMQ.js";import"./useLabels-CXdioV2U.js";import"./index-B7KODvs-.js";import"./index-BKN9BsH4.js";import"./spacing.props-m9PQeFPu.js";import"./Label-x6hg8m87.js";import"./useFormReset-JKupIHyW.js";import"./Input-FLKGWv3G.js";import"./TextField-Cu1PFB9q.js";import"./OverlayArrow-CR591i--.js";const Me={title:"Backstage UI/Menu",component:n.Root},h=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Blueberry",value:"blueberry"},{label:"Cherry",value:"cherry"},{label:"Durian",value:"durian"},{label:"Elderberry",value:"elderberry"},{label:"Fig",value:"fig"},{label:"Grape",value:"grape"},{label:"Honeydew",value:"honeydew"}],o={args:{children:void 0},render:r=>e.jsxs(n.Root,{...r,children:[e.jsx(n.Trigger,{render:t=>e.jsx(c,{...t,size:"small",variant:"secondary",iconEnd:e.jsx(m,{name:"chevron-down"}),children:"Menu"})}),e.jsx(n.Portal,{children:e.jsx(n.Positioner,{sideOffset:8,align:"start",children:e.jsxs(n.Popup,{children:[e.jsx(n.Item,{children:"Settings"}),e.jsx(n.Item,{children:"Invite new members"}),e.jsx(n.Item,{children:"Download app"}),e.jsx(n.Item,{children:"Log out"})]})})})]})},i={args:{...o.args,open:!0},render:o.render},a={args:{...o.args,openOnHover:!0},render:o.render},l={args:{children:void 0},render:r=>e.jsxs(n.Root,{...r,children:[e.jsx(n.Trigger,{render:t=>e.jsx(c,{...t,size:"small",variant:"secondary",iconEnd:e.jsx(m,{name:"chevron-down"}),children:"Menu"})}),e.jsx(n.Portal,{children:e.jsx(n.Positioner,{sideOffset:8,align:"start",children:e.jsxs(n.Popup,{children:[e.jsx(n.Item,{children:"Settings"}),e.jsx(n.Item,{children:"Invite new members"}),e.jsx(n.Item,{children:"Download app"}),e.jsx(n.Item,{children:"Log out"}),e.jsxs(n.Root,{children:[e.jsx(n.SubmenuTrigger,{children:"Submenu"}),e.jsx(n.Portal,{children:e.jsx(n.Positioner,{children:e.jsxs(n.Popup,{children:[e.jsx(n.Item,{children:"Submenu Item 1"}),e.jsx(n.Item,{children:"Submenu Item 2"}),e.jsx(n.Item,{children:"Submenu Item 3"})]})})})]})]})})})]})},s=()=>{const[r,t]=M.useState([]);return e.jsxs(p,{direction:"column",gap:"1",align:"start",children:[e.jsx(g,{style:{marginBottom:16},children:r.length===0?"Which is your favorite fruit?":`Yum, ${r[0]} is delicious!`}),e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{render:d=>e.jsx(c,{...d,size:"small",variant:"secondary",iconEnd:e.jsx(m,{name:"chevron-down"}),children:"Select Fruits"})}),e.jsx(n.Portal,{children:e.jsx(n.Positioner,{sideOffset:4,align:"start",children:e.jsxs(n.Popup,{children:[e.jsx(n.Item,{children:"Regular Item"}),e.jsxs(n.Root,{children:[e.jsx(n.SubmenuTrigger,{children:"Fruits"}),e.jsx(n.Portal,{children:e.jsx(n.Positioner,{sideOffset:8,align:"start",children:e.jsx(n.Popup,{children:e.jsx(n.Combobox,{options:h,value:r,onValueChange:t})})})})]}),e.jsx(n.Item,{children:"Another Item"})]})})})]})]})},u=()=>{const[r,t]=M.useState([]);return e.jsxs(p,{direction:"column",gap:"1",align:"start",children:[e.jsx(g,{style:{marginBottom:16},children:r.length===0?"Tell us what fruits you like.":`${r.join(", ")} would make for a great, healthy smoothy!`}),e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{render:d=>e.jsx(c,{...d,size:"small",variant:"secondary",iconEnd:e.jsx(m,{name:"chevron-down"}),children:"Select Fruits"})}),e.jsx(n.Portal,{children:e.jsx(n.Positioner,{children:e.jsxs(n.Popup,{children:[e.jsx(n.Item,{children:"Regular Item"}),e.jsxs(n.Root,{children:[e.jsx(n.SubmenuTrigger,{children:"Fruits"}),e.jsx(n.Portal,{children:e.jsx(n.Positioner,{children:e.jsx(n.Popup,{children:e.jsx(n.Combobox,{multiselect:!0,options:h,value:r,onValueChange:t})})})})]}),e.jsx(n.Item,{children:"Another Item"})]})})})]})]})};s.__docgenInfo={description:"",methods:[],displayName:"SubmenuCombobox"};u.__docgenInfo={description:"",methods:[],displayName:"SubmenuComboboxMultiselect"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: undefined
  },
  render: args => <Menu.Root {...args}>
      <Menu.Trigger render={props => <Button {...props} size="small" variant="secondary" iconEnd={<Icon name="chevron-down" />}>
            Menu
          </Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start">
          <Menu.Popup>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>Invite new members</Menu.Item>
            <Menu.Item>Download app</Menu.Item>
            <Menu.Item>Log out</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    open: true
  },
  render: Default.render
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    openOnHover: true
  },
  render: Default.render
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: undefined
  },
  render: args => <Menu.Root {...args}>
      <Menu.Trigger render={props => <Button {...props} size="small" variant="secondary" iconEnd={<Icon name="chevron-down" />}>
            Menu
          </Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start">
          <Menu.Popup>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>Invite new members</Menu.Item>
            <Menu.Item>Download app</Menu.Item>
            <Menu.Item>Log out</Menu.Item>
            <Menu.Root>
              <Menu.SubmenuTrigger>Submenu</Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup>
                    <Menu.Item>Submenu Item 1</Menu.Item>
                    <Menu.Item>Submenu Item 2</Menu.Item>
                    <Menu.Item>Submenu Item 3</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
}`,...l.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  return <Flex direction="column" gap="1" align="start">
      <Text style={{
      marginBottom: 16
    }}>
        {selectedValues.length === 0 ? 'Which is your favorite fruit?' : \`Yum, \${selectedValues[0]} is delicious!\`}
      </Text>
      <Menu.Root>
        <Menu.Trigger render={props => <Button {...props} size="small" variant="secondary" iconEnd={<Icon name="chevron-down" />}>
              Select Fruits
            </Button>} />
        <Menu.Portal>
          <Menu.Positioner sideOffset={4} align="start">
            <Menu.Popup>
              <Menu.Item>Regular Item</Menu.Item>
              <Menu.Root>
                <Menu.SubmenuTrigger>Fruits</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner sideOffset={8} align="start">
                    <Menu.Popup>
                      <Menu.Combobox options={options} value={selectedValues} onValueChange={setSelectedValues} />
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
              <Menu.Item>Another Item</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Flex>;
}`,...s.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  return <Flex direction="column" gap="1" align="start">
      <Text style={{
      marginBottom: 16
    }}>
        {selectedValues.length === 0 ? 'Tell us what fruits you like.' : \`\${selectedValues.join(', ')} would make for a great, healthy smoothy!\`}
      </Text>
      <Menu.Root>
        <Menu.Trigger render={props => <Button {...props} size="small" variant="secondary" iconEnd={<Icon name="chevron-down" />}>
              Select Fruits
            </Button>} />
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>Regular Item</Menu.Item>
              <Menu.Root>
                <Menu.SubmenuTrigger>Fruits</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup>
                      <Menu.Combobox multiselect options={options} value={selectedValues} onValueChange={setSelectedValues} />
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
              <Menu.Item>Another Item</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Flex>;
}`,...u.parameters?.docs?.source}}};const ge=["Default","Open","OpenOnHover","Submenu","SubmenuCombobox","SubmenuComboboxMultiselect"];export{o as Default,i as Open,a as OpenOnHover,l as Submenu,s as SubmenuCombobox,u as SubmenuComboboxMultiselect,ge as __namedExportsOrder,Me as default};
