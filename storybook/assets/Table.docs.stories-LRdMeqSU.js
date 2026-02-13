import{j as e,r as a}from"./iframe-DBsVXRYe.js";import{t as C,u as p,T as d,s as b,e as T,C as S,f as j,g as h}from"./utils-76IbZNQ9.js";import{F as v}from"./Flex-BARBcELh.js";import{R as f,a as c}from"./RadioGroup-B6BcnmzC.js";import{T as x}from"./Text-DrZI88_f.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-ygfmXCT9.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-DuCQHMKr.js";import"./useFocusable-CINY0Ell.js";import"./useObjectRef-IXu9J1wk.js";import"./useEvent-CDxAO4ft.js";import"./SelectionIndicator-DKJFBkqO.js";import"./context-Cgi1B9S4.js";import"./usePress-C6DQ5Myx.js";import"./Hidden-CTN0pdgd.js";import"./useControlledState-D3VwFpoB.js";import"./index-DHoTzoGa.js";import"./Checkbox-CZVv_CYU.js";import"./RSPContexts-B1LQg2VI.js";import"./utils-CfMDylIf.js";import"./Form-Cy_j_Kzo.js";import"./useToggle-YK0EhyKG.js";import"./useFormReset-BY-YQd2-.js";import"./useToggleState-DEoM7B5E.js";import"./useFocusRing-hILYSl7p.js";import"./VisuallyHidden-DVrPZ1Lx.js";import"./InternalLinkProvider-XmnCKCUT.js";import"./index-D7OOdF3Y.js";import"./VisuallyHidden-ITmPemi2.js";import"./TablePagination-0LWy4UBd.js";import"./Select-3OUt9rJL.js";import"./Dialog-DR6WdkKl.js";import"./Button-ej80r4i7.js";import"./Label-BjQLMAOF.js";import"./useLabel-B1HzYN67.js";import"./useLabels-CVcX7O3a.js";import"./useButton-CAv_GMQx.js";import"./OverlayArrow-CpxEkKj6.js";import"./Separator-CwoWBkPL.js";import"./Text-BPqp3rsX.js";import"./useLocalizedStringFormatter-vKMt2D79.js";import"./animation-C6BgWy_U.js";import"./FieldError-CpPzdhsb.js";import"./ListBox-BUjxfdgT.js";import"./useListState-BVFTFBNU.js";import"./useField-BPLNPWDD.js";import"./Popover.module-DeEiA6vT.js";import"./Autocomplete-DIDQ5OXW.js";import"./Input-BVUoJ6B3.js";import"./SearchField-CG5oVnZI.js";import"./FieldLabel-DSB1eMEj.js";import"./FieldError-DOrvp6PX.js";import"./ButtonIcon-O-w-i2-U.js";import"./defineComponent-C5DMs0kR.js";import"./useBg-k0Q-GIg9.js";import"./Link-D3huaweV.js";import"./useLink-Dll2u2Pt.js";import"./Avatar-DHuuupXA.js";import"./useHighlightSelectionDescription-nSuHmAkN.js";import"./useHasTabbableChild-BudCWLAt.js";const Fe={title:"Backstage UI/Table/docs",...C},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,defaultWidth:"4fr",cell:t=>e.jsx(T,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",defaultWidth:"4fr",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(f,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(c,{value:"single",children:"single"}),e.jsx(c,{value:"multiple",children:"multiple"})]})]})]})}},m={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(f,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(c,{value:"toggle",children:"toggle"}),e.jsx(c,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
