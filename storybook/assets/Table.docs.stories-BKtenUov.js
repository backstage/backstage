import{j as e,r as a}from"./iframe-Bz1IoDwg.js";import{t as C,u as p,T as d,s as b,e as T,C as S,f as j,g as h}from"./utils-TpOG4HtT.js";import{F as v}from"./Flex-2iq1NmmI.js";import{R as f,a as c}from"./RadioGroup-D9lejlIh.js";import{T as x}from"./Text-ghSPJ5ze.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles--b5PDAmN.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-lF0zBdrp.js";import"./useFocusable-pWFtX-D1.js";import"./useObjectRef-Dm63Dz5Y.js";import"./useEvent-B2wxrNr-.js";import"./SelectionIndicator-CG3UpfCO.js";import"./context-JudSDgqj.js";import"./usePress-BAC0Y8a_.js";import"./Hidden-CMytihhx.js";import"./useControlledState-o3JNaQg_.js";import"./index-CgTx3hsp.js";import"./Checkbox-D8GCY0Xj.js";import"./RSPContexts-lj7daH5m.js";import"./utils-BOaLgOtW.js";import"./Form-DNNEgc5U.js";import"./useToggle-B_CAWrBa.js";import"./useFormReset-C1OaO5sm.js";import"./useToggleState-CKERhg6p.js";import"./useFocusRing-D_6m-nG3.js";import"./VisuallyHidden-6jCMCWhC.js";import"./InternalLinkProvider-D6aqOSqf.js";import"./index-CrqMr4SR.js";import"./VisuallyHidden-L8Ph2Enh.js";import"./TablePagination-C1N2CXX7.js";import"./Select-BMYqNcnE.js";import"./Dialog-BmXn8DT9.js";import"./Button-CmTDca3V.js";import"./Label-DLGw3hNL.js";import"./useLabel-BZYyEHoL.js";import"./useLabels-sSEIU_Ef.js";import"./useButton-3Offjs8f.js";import"./OverlayArrow-Bt37JOB_.js";import"./Separator-Do54Xeln.js";import"./Text-BdHxxere.js";import"./useLocalizedStringFormatter-Ct3L1zcG.js";import"./animation-DDZIeGWR.js";import"./FieldError-eB3zt1Uc.js";import"./ListBox-07OVfKnC.js";import"./useListState-vOw4pMjs.js";import"./useField-DlZ3DfaI.js";import"./Popover.module-CIIeSXYs.js";import"./Autocomplete-DkjmjA3E.js";import"./Input-BYW0ypEc.js";import"./SearchField-Bixp4srZ.js";import"./FieldLabel-BfP3XYs-.js";import"./FieldError-DmzplrNX.js";import"./ButtonIcon-D0yB_IXn.js";import"./defineComponent-C7bLAPmD.js";import"./useSurface-BwMxltpk.js";import"./Link-B1Eddv2e.js";import"./useLink-CL7QIzeZ.js";import"./Avatar-D04dgX9L.js";import"./useHighlightSelectionDescription-DXR4QeKj.js";import"./useHasTabbableChild-C8r1NdqN.js";const Fe={title:"Backstage UI/Table/docs",...C},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,defaultWidth:"4fr",cell:t=>e.jsx(T,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",defaultWidth:"4fr",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(f,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(c,{value:"single",children:"single"}),e.jsx(c,{value:"multiple",children:"multiple"})]})]})]})}},m={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(f,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(c,{value:"toggle",children:"toggle"}),e.jsx(c,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const Me=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{m as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Me as __namedExportsOrder,Fe as default};
