import{j as o}from"./iframe-C9MahRWh.js";import{c as e}from"./plugin-s8_OUas1.js";import{S as l}from"./Grid-Bq14PCTk.js";import{C as m}from"./ComponentAccordion-CXTQGWTQ.js";import{w as a}from"./appWrappers-CVRFJ8fS.js";import{T as i}from"./TemplateBackstageLogoIcon-DW0uIlDC.js";import{I as s}from"./InfoCard-C-Ku1r86.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-COyD8Ape.js";import"./componentData-BjbrQk5D.js";import"./useAnalytics-BziQWZJs.js";import"./useApp-jr5Pcjzr.js";import"./useRouteRef-C79sp_qC.js";import"./index-Y3I5MZ_O.js";import"./DialogTitle-XE_ReIcx.js";import"./Modal-C6HnS9UY.js";import"./Portal-CaSAJtdX.js";import"./Backdrop-B07gdzN9.js";import"./Button-Dzp_nJek.js";import"./useObservable-s32LqZTU.js";import"./useIsomorphicLayoutEffect-DEny9FEg.js";import"./ExpandMore-C29ppj5F.js";import"./AccordionDetails-DeCV1Glt.js";import"./index-B9sM2jn7.js";import"./Collapse-COZrbk8h.js";import"./useAsync-BWwk_eba.js";import"./useMountedState-Dn_kttD3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-oIyv0kn_.js";import"./ErrorBoundary-DViLc_vS.js";import"./ErrorPanel-Cd_NhFA3.js";import"./WarningPanel-NX0KfHXh.js";import"./MarkdownContent-D9IOtBE8.js";import"./CodeSnippet-n_l-Y6Rc.js";import"./Box-CYNkyMDT.js";import"./styled-DiHiiZIS.js";import"./CopyTextButton-6HBTp066.js";import"./useCopyToClipboard-CMkmug0-.js";import"./Tooltip-BxZhHFnO.js";import"./Popper-BxhcTIEV.js";import"./List-Bf1QAwLS.js";import"./ListContext-C4u9JBBU.js";import"./ListItem-CEqAAvo8.js";import"./ListItemText-ULNmgNfA.js";import"./LinkButton-LGqlLhF5.js";import"./Link-hmIS8MxR.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DlTILyHC.js";import"./Divider-BPY2Btf9.js";import"./CardActions-DJNyFBXf.js";import"./BottomLink-B7oZiutG.js";import"./ArrowForward-DNeec2hd.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
