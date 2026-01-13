import{j as e,r as a}from"./iframe-DFN6SAj3.js";import{t as T,u as p,T as d,s as b,e as f,C as S,f as j,g as h}from"./utils-CURS6FZb.js";import{F as v}from"./Flex-Dc6Fn51M.js";import{R as x,a as m}from"./RadioGroup-B46cdjw2.js";import{T as C}from"./Text-DZ5o8eVF.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-DaQj56o8.js";import"./clsx-B-dksMZM.js";import"./useListState-Dq8yYTzv.js";import"./useFocusable-BqV40-mu.js";import"./useObjectRef-Dg08NMj-.js";import"./usePress-vdIMkS3w.js";import"./useEvent-DGXsBPji.js";import"./SelectionIndicator-CO7nDxl9.js";import"./context-DAG0vsnX.js";import"./Hidden-B4o_BYU0.js";import"./useControlledState-Brt6Ny7j.js";import"./index-CWKYqCX3.js";import"./Checkbox-CoSt-O7a.js";import"./RSPContexts-B9rhbHT1.js";import"./utils-Bfjqt0Ay.js";import"./Form-B41r19Qw.js";import"./useToggle-CyWk4YId.js";import"./useFormReset-CQb_uMIr.js";import"./useToggleState-NGf5lFJ8.js";import"./useFocusRing-BJ5ZSrxY.js";import"./VisuallyHidden-LKIi0bVz.js";import"./isExternalLink-DzQTpl4p.js";import"./index-BUG12Py2.js";import"./VisuallyHidden-GJApReGl.js";import"./TablePagination-DvcwDpJy.js";import"./Select-BRidrB8C.js";import"./Dialog-_0O8mKte.js";import"./ListBox-C9Gc4fMw.js";import"./Text-wo0eSwpS.js";import"./useLabel-DH47co1_.js";import"./useLabels-8yrTN_aE.js";import"./useLocalizedStringFormatter-B9AAQgKo.js";import"./Button-CewZAUMg.js";import"./Label-DSJtZte4.js";import"./useButton-4oKFdG4C.js";import"./OverlayArrow-D1Fd-dyl.js";import"./FieldError-CqUjgKGD.js";import"./Input-CGJSOyE7.js";import"./SearchField-BNsmZb9W.js";import"./FieldLabel-CC6OPSaD.js";import"./FieldError-Bw3II3bl.js";import"./ButtonIcon-B0ZX66hT.js";import"./Button.module-DkEJAzA0.js";import"./Link-DDSMAdIk.js";import"./useLink-DpagGf2g.js";import"./Avatar-DvF3DF1w.js";import"./useHighlightSelectionDescription-BkpJ4RZ2.js";import"./useHasTabbableChild-DSTncWf_.js";import"./useSurface-CpQk2yDD.js";const Be={title:"Backstage UI/Table/docs",...T},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(f,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:n}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...n})}},r={render:()=>{const[o,n]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:n},rowConfig:{onClick:i=>alert(`Clicked: ${i.name}`)}})}},s={render:()=>{const[o,n]=a.useState("multiple"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(x,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,n]=a.useState("toggle"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(x,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const Pe=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Pe as __namedExportsOrder,Be as default};
