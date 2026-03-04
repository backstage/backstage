import{j as e,r as a}from"./iframe-DC0HuKGF.js";import{t as C,s as b,d as T,a as h}from"./utils-crn--YlH.js";import{u as p,T as d,e as j,C as S}from"./useTable-BkinaYrA.js";import{F as v}from"./Flex-Cr1UaxzJ.js";import{R as f,a as m}from"./RadioGroup-D7seMVgr.js";import{T as x}from"./Text-btCq5Gfg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B88MtuqO.js";import"./SelectionManager-BZ21sLla.js";import"./useFocusable-CworoZuF.js";import"./useObjectRef-CUy8bK3M.js";import"./useEvent-DN9pGIrT.js";import"./SelectionIndicator-CuedDAEX.js";import"./context-CvHDVD3r.js";import"./usePress-ohDWbPX7.js";import"./Hidden-KSwhlm6b.js";import"./useControlledState-C0mzGUjt.js";import"./index-DnwCBnK_.js";import"./Checkbox-B7hpkZKO.js";import"./RSPContexts-o8rYhzbO.js";import"./utils-Cn61JNwH.js";import"./Form-CHahSWJY.js";import"./useToggle-DEMd7PhX.js";import"./useFormReset-Mxhy9PMf.js";import"./useToggleState-C4qONTTQ.js";import"./useFocusRing-DL_VlKxz.js";import"./VisuallyHidden-kLzCBSwH.js";import"./InternalLinkProvider-BTXOTn27.js";import"./VisuallyHidden-D8BCmoDv.js";import"./TablePagination-DbYJKo4c.js";import"./Select-CDh6y9mx.js";import"./Dialog-BdKmtOk7.js";import"./Button-DgKGkMSg.js";import"./Label-DZKGqgzf.js";import"./useLabel-MIMNbo6g.js";import"./useLabels-DEEXvcdx.js";import"./useButton-DlNeywlF.js";import"./OverlayArrow-Bq-Tcr_a.js";import"./Separator-Bdt5BsI4.js";import"./Text-Vkea2uFM.js";import"./useLocalizedStringFormatter-CmqXErQQ.js";import"./animation-kImUn86E.js";import"./FieldError-BdLFjMq8.js";import"./ListBox-B9K7lhL-.js";import"./useListState-DUlu7stt.js";import"./useField-CVtVQ_gS.js";import"./definition-PdVSyMRN.js";import"./Autocomplete-D7nI4_y-.js";import"./Input-CdydUl1t.js";import"./SearchField-zBPZLMNP.js";import"./FieldError-Dgt4t-Zh.js";import"./FieldLabel-B584UmLP.js";import"./ButtonIcon-DIFfmoCh.js";import"./Link-CiAkio7o.js";import"./useLink-BQurpmIw.js";import"./useHighlightSelectionDescription-cln7mkYM.js";import"./useHasTabbableChild-DbEBzsAQ.js";import"./Avatar-DDdkh8Cx.js";const De={title:"Backstage UI/Table/docs",...C},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,defaultWidth:"4fr",cell:t=>e.jsx(j,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",defaultWidth:"4fr",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>T,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(f,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(f,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const ye=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,ye as __namedExportsOrder,De as default};
