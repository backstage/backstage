import{j as e,r as a}from"./iframe-CIdfBUNc.js";import{t as T,u as p,T as d,s as b,e as f,C as S,f as j,g as h}from"./utils-CClKixUU.js";import{F as v}from"./Flex-BzVtlb2l.js";import{R as x,a as m}from"./RadioGroup-CY6MydQ6.js";import{T as C}from"./Text-fCVoI7lV.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-DpbhKiTz.js";import"./clsx-B-dksMZM.js";import"./useListState-Cz7KwnIh.js";import"./useFocusable-CPjX_ZwV.js";import"./useObjectRef-DgB1_A6b.js";import"./usePress-Caq6LyaY.js";import"./useEvent-1jKoOzqm.js";import"./SelectionIndicator-DOD2f3eX.js";import"./context-DVadYFRF.js";import"./Hidden-nXB6U8Ip.js";import"./useControlledState-CeIJUDVt.js";import"./index-BHOfiGUs.js";import"./Checkbox-Ca-6aB2I.js";import"./RSPContexts-BprzaPX6.js";import"./utils-Cjmj99xt.js";import"./Form-CwTGXXRj.js";import"./useToggleState-Doozm-ZI.js";import"./useFormReset-DfTTI6Xy.js";import"./useFocusRing-DlPxtRlU.js";import"./VisuallyHidden-CWRgOWii.js";import"./isExternalLink-DzQTpl4p.js";import"./index-6Q4r393t.js";import"./VisuallyHidden-CI7mc6P8.js";import"./TablePagination-COS4dg5Y.js";import"./Select-BWkkhbSZ.js";import"./Dialog-DU_eiDEs.js";import"./ListBox-CK5nRji4.js";import"./Text-CYbs9Rda.js";import"./useLabel-DJE6Cj25.js";import"./useLabels-DApO1jR3.js";import"./useLocalizedStringFormatter-D_8Tctws.js";import"./Button-Ba3dPinB.js";import"./Label-BUxvg70y.js";import"./OverlayArrow-DR8yh5th.js";import"./FieldError-Bik11OU1.js";import"./Input-oT3MkX-h.js";import"./SearchField-4UTBJ9KR.js";import"./FieldLabel-53QoVcAU.js";import"./FieldError-H-sjjaZr.js";import"./ButtonIcon-ComFy0XB.js";import"./Button.module-gtToApuQ.js";import"./Link-BpcnesLj.js";import"./useLink-CXftnk8X.js";import"./Avatar-CuHBx4OW.js";import"./useHighlightSelectionDescription-DM5mKZlW.js";import"./useHasTabbableChild-BwPflv97.js";import"./useSurface-Dd5zaFJi.js";const je={title:"Backstage UI/Table/docs",...T},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(f,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:n}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...n})}},r={render:()=>{const[o,n]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:n},rowConfig:{onClick:i=>alert(`Clicked: ${i.name}`)}})}},s={render:()=>{const[o,n]=a.useState("multiple"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(x,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,n]=a.useState("toggle"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(x,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [{
      id: 'name',
      label: 'Band name',
      isRowHeader: true,
      cell: item => <CellProfile name={item.name} src={item.image} href={item.website} />
    }, {
      id: 'genre',
      label: 'Genre',
      cell: item => <CellText title={item.genre} />
    }, {
      id: 'yearFormed',
      label: 'Year formed',
      cell: item => <CellText title={item.yearFormed.toString()} />
    }, {
      id: 'albums',
      label: 'Albums',
      cell: item => <CellText title={item.albums.toString()} />
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => data4,
      paginationOptions: {
        pageSize: 5
      }
    });
    return <Table columnConfig={columns} {...tableProps} />;
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: {
        pageSize: 10
      }
    });
    return <Table {...tableProps} columnConfig={selectionColumns} selection={{
      mode: 'multiple',
      behavior: 'toggle',
      selected,
      onSelectionChange: setSelected
    }} rowConfig={{
      onClick: item => alert(\`Clicked: \${item.name}\`)
    }} />;
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('multiple');
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: {
        pageSize: 10
      }
    });
    return <Flex direction="column" gap="8">
        <Table {...tableProps} columnConfig={selectionColumns} selection={{
        mode: selectionMode,
        behavior: 'toggle',
        selected,
        onSelectionChange: setSelected
      }} />
        <div>
          <Text as="h4" style={{
          marginBottom: 'var(--bui-space-2)'
        }}>
            Selection mode:
          </Text>
          <RadioGroup aria-label="Selection mode" orientation="horizontal" value={selectionMode} onChange={value => {
          setSelectionMode(value as 'single' | 'multiple');
          setSelected(new Set());
        }}>
            <Radio value="single">single</Radio>
            <Radio value="multiple">multiple</Radio>
          </RadioGroup>
        </div>
      </Flex>;
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selectionBehavior, setSelectionBehavior] = useState<'toggle' | 'replace'>('toggle');
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: {
        pageSize: 10
      }
    });
    return <Flex direction="column" gap="8">
        <Table {...tableProps} columnConfig={selectionColumns} selection={{
        mode: 'multiple',
        behavior: selectionBehavior,
        selected,
        onSelectionChange: setSelected
      }} />
        <div>
          <Text as="h4" style={{
          marginBottom: 'var(--bui-space-2)'
        }}>
            Selection behavior:
          </Text>
          <RadioGroup aria-label="Selection behavior" orientation="horizontal" value={selectionBehavior} onChange={value => {
          setSelectionBehavior(value as 'toggle' | 'replace');
          setSelected(new Set());
        }}>
            <Radio value="toggle">toggle</Radio>
            <Radio value="replace">replace</Radio>
          </RadioGroup>
        </div>
      </Flex>;
  }
}`,...c.parameters?.docs?.source}}};const Re=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Re as __namedExportsOrder,je as default};
