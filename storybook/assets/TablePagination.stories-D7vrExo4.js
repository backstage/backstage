import{T as l}from"./TablePagination-DkXn5X7E.js";import"./iframe-DagLMla0.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-wQ2Jx8X5.js";import"./index-DwjklBa5.js";import"./useObjectRef-Cb8HRT-z.js";import"./Select-BIpZ0KrZ.js";import"./Dialog-zqP251qk.js";import"./Button-DZc9Enob.js";import"./utils-Cc_A0DgX.js";import"./Label-BMPPDm7Q.js";import"./Hidden-ClFwjn4q.js";import"./useFocusable-BCMv3E05.js";import"./useLabel-CoPPX9Ip.js";import"./useLabels-DKiqHSPy.js";import"./context-DHKKpdNC.js";import"./useButton-D9BJCUxP.js";import"./usePress-lqe-0kac.js";import"./useFocusRing-BjTZ4siM.js";import"./RSPContexts-BST9G051.js";import"./OverlayArrow-CPerN2fV.js";import"./useControlledState-D0awditL.js";import"./SelectionManager-B7LD5O_3.js";import"./useEvent-BVn_L9yV.js";import"./SelectionIndicator-gELnvTUD.js";import"./Separator-g-SYD0Tf.js";import"./Text-BBp-mWry.js";import"./useLocalizedStringFormatter-Co06QSh7.js";import"./animation-DJoAXbJ2.js";import"./VisuallyHidden-DOp0ud0Z.js";import"./FieldError-BzXCGqX7.js";import"./Form-BHYw4yXk.js";import"./ListBox-DooZ1r9a.js";import"./useListState-nmF_MNLe.js";import"./useField--RhdZAJl.js";import"./useFormReset-DNDqb84w.js";import"./Popover.module-DeEiA6vT.js";import"./Autocomplete-D82K4uVl.js";import"./Input-CqYZRsk6.js";import"./SearchField-DzeBiUwx.js";import"./FieldLabel-CYqdn1tj.js";import"./FieldError-Dp_Jrh6_.js";import"./ButtonIcon-DGi7vVUB.js";import"./defineComponent-DL4axF5-.js";import"./useBg-CpNI-B1I.js";import"./Text-CIxOQPjX.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:l,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},s={args:{...e.args,showPageSizeOptions:!1}},t={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:c,totalCount:m})=>{const u=Math.floor((g??0)/c)+1,P=Math.ceil((m??0)/c);return`Page ${u} of ${P}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => (
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
