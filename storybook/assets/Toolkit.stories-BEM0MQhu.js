import{j as o}from"./iframe-BJLAQiny.js";import{c as e}from"./plugin-B5ZLJ7gh.js";import{S as l}from"./Grid-85KaXqj6.js";import{C as m}from"./ComponentAccordion-BF6GQ57r.js";import{w as a}from"./appWrappers-Ch3ZwAuI.js";import{T as i}from"./TemplateBackstageLogoIcon-DoOjaZZ5.js";import{I as s}from"./InfoCard-yPFTnu1Z.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CG7_4OWW.js";import"./componentData-Bg3JyZcy.js";import"./useAnalytics-W203HJ0-.js";import"./useApp-BTkCnRE2.js";import"./useRouteRef-CVo3EImE.js";import"./index-bnZRQeHC.js";import"./DialogTitle-BYsWp0dH.js";import"./Modal-98ZwNGha.js";import"./Portal-B2YIacrT.js";import"./Backdrop-BKPXV1ri.js";import"./Button-CtgRUIFg.js";import"./useObservable-DxZEzPKu.js";import"./useIsomorphicLayoutEffect-YDmtHS5G.js";import"./ExpandMore-C9SKMfwh.js";import"./AccordionDetails-BeK8TLKU.js";import"./index-DnL3XN75.js";import"./Collapse-Dyo3yIeQ.js";import"./useAsync-D_PwxK1T.js";import"./useMountedState-DW1n1H5-.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C84WVsF3.js";import"./ErrorBoundary-iG0FMg2_.js";import"./ErrorPanel-C7O53zca.js";import"./WarningPanel-Cx0u9N3G.js";import"./MarkdownContent-C9K6rk9j.js";import"./CodeSnippet-BCiMU4qs.js";import"./Box-DBjVidWA.js";import"./styled-Dbum34QX.js";import"./CopyTextButton-qCRVuup2.js";import"./useCopyToClipboard-WIY93EcD.js";import"./Tooltip-DWt_B2xO.js";import"./Popper-DQtSbLkc.js";import"./List-DMFoD1Fa.js";import"./ListContext-HC4v7bkz.js";import"./ListItem-Ccj_bLuX.js";import"./ListItemText-B0trVnJh.js";import"./LinkButton-B7rqQyTO.js";import"./Link-BsQxZTCc.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DOZJLl26.js";import"./Divider-DsKh9GaH.js";import"./CardActions-Cs4T3KjN.js";import"./BottomLink-Wm-pDfIj.js";import"./ArrowForward-Ds6zgypX.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
