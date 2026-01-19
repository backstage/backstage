import{j as o}from"./iframe-BooBp-Po.js";import{c as e}from"./plugin-CCaDKLYY.js";import{S as l}from"./Grid-DyVJyHQ5.js";import{C as m}from"./ComponentAccordion-CU6FZHuX.js";import{w as a}from"./appWrappers-CTUrCtOx.js";import{T as i}from"./TemplateBackstageLogoIcon-DIRXz3UO.js";import{I as s}from"./InfoCard-DIPvFOR7.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B6z4Q4HB.js";import"./componentData-UC---0ba.js";import"./useAnalytics-B6NIIYQR.js";import"./useApp-BELQ6JvB.js";import"./useRouteRef-C16BXt-W.js";import"./index-uVUaDJuf.js";import"./DialogTitle-CrfKXT0M.js";import"./Modal-cDnVm_jG.js";import"./Portal-TbQYoDFY.js";import"./Backdrop-B9Tcq6ce.js";import"./Button-Cv3OLp_n.js";import"./useObservable-NJCYJyLg.js";import"./useIsomorphicLayoutEffect-BOg_mT4I.js";import"./ExpandMore-Bspz5IQW.js";import"./AccordionDetails-DxggSv3D.js";import"./index-B9sM2jn7.js";import"./Collapse-CmSq19t6.js";import"./useAsync-BkydaeDo.js";import"./useMountedState-BZIVYzWq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-C0i9nHGG.js";import"./ErrorBoundary-D5Pk8kNF.js";import"./ErrorPanel-J8VMJBUn.js";import"./WarningPanel-Df9ZONi2.js";import"./MarkdownContent-BDjlG_JM.js";import"./CodeSnippet-L6pub6pc.js";import"./Box-obs2E8MU.js";import"./styled-DJvGKcz3.js";import"./CopyTextButton-CtUqznh5.js";import"./useCopyToClipboard-B64G66d9.js";import"./Tooltip-C6PmnGP2.js";import"./Popper-m5liQdCd.js";import"./List-Cb7k0m_f.js";import"./ListContext-5jNT-Bcm.js";import"./ListItem-CUDBczQT.js";import"./ListItemText-Bjf3smxb.js";import"./LinkButton-DpHtnVgU.js";import"./Link-6ZJtYR0w.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DbBll6nT.js";import"./Divider-k2YJ45XN.js";import"./CardActions-CisRazDZ.js";import"./BottomLink-fNgaEPxJ.js";import"./ArrowForward-B0hk3RK2.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
