import{j as e,r as a}from"./iframe-CDMGjht1.js";import{t as T,u as p,T as d,s as b,e as f,C as S,f as j,g as h}from"./utils-CvPuQpfD.js";import{F as v}from"./Flex-D1ckmWJU.js";import{R as x,a as m}from"./RadioGroup-BmGZPWlY.js";import{T as C}from"./Text-CuCiW2xy.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-BuXaoLuy.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-DuDRr8lf.js";import"./useFocusable-e06xOYAF.js";import"./useObjectRef-vqxPmU1u.js";import"./usePress-CY1aMgW_.js";import"./useEvent-DILQypF3.js";import"./SelectionIndicator-CUpmD4Gv.js";import"./context-C7Z1Yniv.js";import"./Hidden-CVnTALYq.js";import"./useControlledState-DSo8XaCD.js";import"./index-6ni4X3d6.js";import"./Checkbox-BUZ0nZrr.js";import"./RSPContexts-Mc7HM6rs.js";import"./utils-g0RWddUU.js";import"./Form-MyXhU_wj.js";import"./useToggle-Dj-VeWNw.js";import"./useFormReset-CXaX4OLp.js";import"./useToggleState-BuD_xqf4.js";import"./useFocusRing-Bfd5vJzE.js";import"./VisuallyHidden-CAnrpvQ7.js";import"./isExternalLink-DzQTpl4p.js";import"./index-K4DNRamS.js";import"./VisuallyHidden-BNeLTOo3.js";import"./TablePagination-D3uvH1jH.js";import"./Select-BOHfBqub.js";import"./Dialog-DtxreU9r.js";import"./Button-DGXKcQj1.js";import"./Label-wv8EHgGG.js";import"./useLabel-D0kuD8t9.js";import"./useLabels-BcDnH4Xe.js";import"./useButton-BWMvR-GB.js";import"./OverlayArrow-CsJQc_bL.js";import"./Separator-DGYxEDQ0.js";import"./Text-BCv3JODw.js";import"./useLocalizedStringFormatter-DlWtLeD0.js";import"./FieldError-BwSrIfys.js";import"./ListBox-BLpAMy-R.js";import"./useListState-DoJEa-Pu.js";import"./useField-CzIEm_1n.js";import"./Popover.module-O5UoF8fw.js";import"./Autocomplete-C7Fkh2RC.js";import"./Input-DgcfFBB0.js";import"./SearchField-CLQ_c-M0.js";import"./FieldLabel-DqbbEhgd.js";import"./FieldError-BOe9GgWK.js";import"./ButtonIcon-BjyXN5M3.js";import"./Button.module-DkEJAzA0.js";import"./Link-kEKrf2OL.js";import"./useLink-Cw6dPxbx.js";import"./Avatar-dnMgfBxJ.js";import"./useHighlightSelectionDescription-Bv0tO2ug.js";import"./useHasTabbableChild-T2IZHt83.js";import"./useSurface-BaT7FJzz.js";const ze={title:"Backstage UI/Table/docs",...T},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(f,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(x,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:u=>{i(u),n(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(x,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:u=>{i(u),n(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const Fe=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Fe as __namedExportsOrder,ze as default};
