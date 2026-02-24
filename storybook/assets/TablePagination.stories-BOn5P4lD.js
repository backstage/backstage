import{T as l}from"./TablePagination-BUjGsilA.js";import"./iframe-n0fImp44.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-DhAOMvc1.js";import"./index-BU7kQHf_.js";import"./useObjectRef-B5k3BPhA.js";import"./Select-C5iNf2x3.js";import"./Dialog-CHqOitbG.js";import"./Button-BTZCZgyh.js";import"./utils-Bq1vmvg7.js";import"./Label-gCeyRKEY.js";import"./Hidden-CH-pWt5S.js";import"./useFocusable-B7b3qeb5.js";import"./useLabel-BvFyeQ9k.js";import"./useLabels-BBhJvysw.js";import"./context-BjCyfsTr.js";import"./useButton-Y25VaaKp.js";import"./usePress-CRHkgW3I.js";import"./useFocusRing-COQbbX-o.js";import"./RSPContexts-B_nU0VZS.js";import"./OverlayArrow-BLF3NdDG.js";import"./useControlledState-BucjZUQj.js";import"./SelectionManager-DrCWxmS2.js";import"./useEvent-u8GPyOD_.js";import"./SelectionIndicator-B5OavJut.js";import"./Separator-IYS7X-A1.js";import"./Text-DIojBtpQ.js";import"./useLocalizedStringFormatter-Oqzp59xu.js";import"./animation-D0X58ScU.js";import"./VisuallyHidden-BVkTRPDk.js";import"./FieldError-DYHLViEp.js";import"./Form-BGnJqD7B.js";import"./ListBox-CzuZzXfp.js";import"./useListState-CThsDZk3.js";import"./useField-CEdnleri.js";import"./useFormReset-Dx3UpLX9.js";import"./Popover.module-DeEiA6vT.js";import"./Autocomplete-DazwJs6Y.js";import"./Input-DNgFJ_e6.js";import"./SearchField-BWsXVo9E.js";import"./FieldLabel-CPL6GDCB.js";import"./FieldError-By4V08T8.js";import"./ButtonIcon-C5CWOAAq.js";import"./defineComponent-CdXrEgwU.js";import"./useBg-D-gC0Gyq.js";import"./Text-Dzu_aZ1e.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:l,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},s={args:{...e.args,showPageSizeOptions:!1}},t={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:c,totalCount:m})=>{const u=Math.floor((g??0)/c)+1,P=Math.ceil((m??0)/c);return`Page ${u} of ${P}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
  <TablePagination
    offset={0}
    pageSize={10}
    totalCount={100}
    hasNextPage
    hasPreviousPage={false}
    onNextPage={noop}
    onPreviousPage={noop}
    onPageSizeChange={noop}
    showPageSizeOptions
  />
);
`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const FirstPage = () => <TablePagination />;
`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const LastPage = () => (
  <TablePagination offset={90} hasNextPage={false} hasPreviousPage />
);
`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const MiddlePage = () => <TablePagination offset={40} hasPreviousPage />;
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const WithoutPageSizeOptions = () => (
  <TablePagination showPageSizeOptions={false} />
);
`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const CursorPagination = () => <TablePagination offset={undefined} />;
`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const CustomLabel = () => (
  <TablePagination
    offset={20}
    hasPreviousPage
    getLabel={({ offset, pageSize, totalCount }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }}
  />
);
`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const EmptyState = () => <TablePagination totalCount={0} hasNextPage={false} />;
`,...i.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{t as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,s as WithoutPageSizeOptions,ce as __namedExportsOrder,pe as default};
