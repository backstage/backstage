import{j as o}from"./iframe-C8uhRVJE.js";import{c as e}from"./plugin-DoC2GKUp.js";import{S as l}from"./Grid-C5ZyGaTv.js";import{C as m}from"./ComponentAccordion-3abK2ES3.js";import{w as a}from"./appWrappers-BWLcUcVY.js";import{T as i}from"./TemplateBackstageLogoIcon-CObh18VY.js";import{I as s}from"./InfoCard-Bk92sx2c.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-_vQLgw_y.js";import"./componentData-COYXa6k6.js";import"./useAnalytics-CMB7EDSs.js";import"./useApp-IzIBR1Vv.js";import"./useRouteRef-B0Vi5G0u.js";import"./index-BYn64cw2.js";import"./DialogTitle-gHgKDmm6.js";import"./Modal-BCg34ymo.js";import"./Portal-DGxbDxZD.js";import"./Backdrop-BYegWcH-.js";import"./Button-BSbGK_Ct.js";import"./useObservable-BasahIcU.js";import"./useIsomorphicLayoutEffect-B6F3ekP_.js";import"./ExpandMore-hZ2c00bV.js";import"./AccordionDetails-CeLa6pif.js";import"./index-B9sM2jn7.js";import"./Collapse-DlLfqGWf.js";import"./useAsync-CISCSNua.js";import"./useMountedState-D0BWMouD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DO-1k1lO.js";import"./ErrorBoundary-Cfj40CJD.js";import"./ErrorPanel-ByR9HTcg.js";import"./WarningPanel-DEmZ2skU.js";import"./MarkdownContent-BWUzH6fM.js";import"./CodeSnippet-BrHkgkym.js";import"./Box-CqSl_hUY.js";import"./styled-CsbE0ba0.js";import"./CopyTextButton-DUWRsVAM.js";import"./useCopyToClipboard-Btd4dIqz.js";import"./Tooltip-Dm66oIkk.js";import"./Popper-DTopPJJ5.js";import"./List-DvPRKsUn.js";import"./ListContext-CLNvlY7i.js";import"./ListItem-CMqPdlpf.js";import"./ListItemText-u8pHhn01.js";import"./LinkButton-CZufjSdE.js";import"./Link-BbMg_ACg.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-HGudaM0-.js";import"./Divider-BSVlJEqX.js";import"./CardActions-CbO-K8b_.js";import"./BottomLink-CsfZ_ZcK.js";import"./ArrowForward-DNYazqhw.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
