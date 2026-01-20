import{j as e,r as a}from"./iframe-Du4yWFmh.js";import{t as C,u as p,T as d,s as b,e as T,C as S,f as j,g as h}from"./utils-JX6FGQ2a.js";import{F as v}from"./Flex-DXAsyrg5.js";import{R as f,a as m}from"./RadioGroup-x1mEtxcE.js";import{T as x}from"./Text-CPIKn4FL.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-BKv47l2R.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-0uJxHsG8.js";import"./useFocusable-Dw78h-Dw.js";import"./useObjectRef-CiRgIA98.js";import"./usePress-qtOIFA-H.js";import"./useEvent-DjPRkiw2.js";import"./SelectionIndicator-BqsEK7dV.js";import"./context-q9taPD0R.js";import"./Hidden-BnC0bDpJ.js";import"./useControlledState-Ck_KVpu8.js";import"./index-CKR81--4.js";import"./Checkbox-D3iogoGg.js";import"./RSPContexts-D_Pwck-t.js";import"./utils-z8eUZOh4.js";import"./Form-CDIuxWPj.js";import"./useToggle-CzDpGD2D.js";import"./useFormReset-CL6tHrdH.js";import"./useToggleState-CbkSPG-t.js";import"./useFocusRing-BvDmeMSb.js";import"./VisuallyHidden-CWR07G8S.js";import"./isExternalLink-DzQTpl4p.js";import"./index-Br3zvZN_.js";import"./VisuallyHidden-wim6c3mr.js";import"./TablePagination-DMc5913T.js";import"./Select-Rm5oQ3uJ.js";import"./Dialog-TCrr6gWF.js";import"./Button-lMiHrIqc.js";import"./Label-CLPT-Yyh.js";import"./useLabel-CbYskFmA.js";import"./useLabels-Blszi5gD.js";import"./useButton-p9vkKM9a.js";import"./OverlayArrow-C8vXibhB.js";import"./Separator-B52XnveC.js";import"./Text-ViNXGalI.js";import"./useLocalizedStringFormatter-DAzOeBuS.js";import"./FieldError-BuAyDXlX.js";import"./ListBox-BCNTmCbD.js";import"./useListState-DOyHQgil.js";import"./useField-FWFEttl4.js";import"./Popover.module-O5UoF8fw.js";import"./Autocomplete-Bnf17Bfp.js";import"./Input-lgLcxgG8.js";import"./SearchField-CjNoJHE8.js";import"./FieldLabel--qmFnZSh.js";import"./FieldError-CimKknyH.js";import"./ButtonIcon-CqHQWAoi.js";import"./Button.module-Duo5NOwC.js";import"./Link-D_1etgqe.js";import"./useLink-C6WTLEVH.js";import"./Avatar-D8RqooBq.js";import"./useHighlightSelectionDescription-CBw_rxCp.js";import"./useHasTabbableChild-DRqG6DwV.js";import"./useSurface-BX-jw8YI.js";const ze={title:"Backstage UI/Table/docs",...C},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,defaultWidth:"4fr",cell:t=>e.jsx(T,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",defaultWidth:"4fr",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(f,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(f,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
