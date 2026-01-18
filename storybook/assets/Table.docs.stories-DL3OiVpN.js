import{j as e,r as a}from"./iframe-Yl0Qc67S.js";import{t as C,u as p,T as d,s as b,e as T,C as S,f as j,g as h}from"./utils-vjEl4m33.js";import{F as v}from"./Flex-CNVottU6.js";import{R as f,a as m}from"./RadioGroup-CGw8c7GK.js";import{T as x}from"./Text-e1ralmud.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-DTd0emH8.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-Dpn-v8ik.js";import"./useFocusable-wWhtWAm1.js";import"./useObjectRef-B1bL3Spk.js";import"./usePress-CFoQbYZv.js";import"./useEvent-DraQqWpZ.js";import"./SelectionIndicator-BIHE5y1O.js";import"./context-DJYRL1Ls.js";import"./Hidden-CLfPS8Bb.js";import"./useControlledState-Ba5xm53c.js";import"./index-CT_LMPAP.js";import"./Checkbox-BqJhh9mk.js";import"./RSPContexts-D6KejDAz.js";import"./utils-BeOnE2ty.js";import"./Form-DapWWiBZ.js";import"./useToggle-Dy3bsvUQ.js";import"./useFormReset-DQN4NfsY.js";import"./useToggleState-C2gnJomk.js";import"./useFocusRing-BU-o61Ng.js";import"./VisuallyHidden-B3651gF8.js";import"./isExternalLink-DzQTpl4p.js";import"./index-CuRibKaG.js";import"./VisuallyHidden-BvNoILaY.js";import"./TablePagination-DqVIvzvx.js";import"./Select-Du6KJHDs.js";import"./Dialog-Ct1I0JHK.js";import"./Button-DiZ0OOlv.js";import"./Label-3HvEqQQJ.js";import"./useLabel-DCoH7jxF.js";import"./useLabels-Cb3b88uk.js";import"./useButton-Dx1qusmW.js";import"./OverlayArrow-CeOOR6os.js";import"./Separator-CEf1MYuT.js";import"./Text-BUTfCmKR.js";import"./useLocalizedStringFormatter-CzIfYiAC.js";import"./FieldError-WNpBQjAM.js";import"./ListBox-GBlVXKSR.js";import"./useListState-Ckvl_P7p.js";import"./useField-I5fVPMAG.js";import"./Popover.module-O5UoF8fw.js";import"./Autocomplete-JGg8eCRx.js";import"./Input-B3YLi1mH.js";import"./SearchField-QorHCr-H.js";import"./FieldLabel-BOh78g34.js";import"./FieldError-BhSUO9Xu.js";import"./ButtonIcon-Cd8JH2KH.js";import"./Button.module-DkEJAzA0.js";import"./Link-BSMf8XJF.js";import"./useLink-CC2E5dm7.js";import"./Avatar-DrppL3j7.js";import"./useHighlightSelectionDescription-BVK9wf1V.js";import"./useHasTabbableChild-DTGmyZ5g.js";import"./useSurface-9-qWkMCN.js";const ze={title:"Backstage UI/Table/docs",...C},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,defaultWidth:"4fr",cell:t=>e.jsx(T,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",defaultWidth:"4fr",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(f,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(f,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [{
      id: 'name',
      label: 'Band name',
      isRowHeader: true,
      defaultWidth: '4fr',
      cell: item => <CellProfile name={item.name} src={item.image} href={item.website} />
    }, {
      id: 'genre',
      label: 'Genre',
      defaultWidth: '4fr',
      cell: item => <CellText title={item.genre} />
    }, {
      id: 'yearFormed',
      label: 'Year formed',
      defaultWidth: '1fr',
      cell: item => <CellText title={item.yearFormed.toString()} />
    }, {
      id: 'albums',
      label: 'Albums',
      defaultWidth: '1fr',
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
}`,...c.parameters?.docs?.source}}};const Fe=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Fe as __namedExportsOrder,ze as default};
