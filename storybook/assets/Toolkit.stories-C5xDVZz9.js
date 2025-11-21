import{j as o}from"./iframe-C8ExrwzU.js";import{c as e}from"./plugin-Cege8qGM.js";import{S as l}from"./Grid-DspeJWIy.js";import{C as m}from"./ComponentAccordion-_ZehRMhq.js";import{w as a}from"./appWrappers-BaMznTf3.js";import{T as i}from"./TemplateBackstageLogoIcon-DIyiGPTy.js";import{I as s}from"./InfoCard-D_4zmvid.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-B2v-vDzx.js";import"./componentData-Dj-cJqs3.js";import"./useAnalytics-BlYc1avD.js";import"./useApp-C7pfrKGm.js";import"./useRouteRef-C6pJYPst.js";import"./index-BgOC1FTX.js";import"./DialogTitle-B89siiWU.js";import"./Modal-DbOcvVvU.js";import"./Portal-BvPm8y4I.js";import"./Backdrop-86Drsiia.js";import"./Button-BirFLWZh.js";import"./useObservable-D53Q4Zoo.js";import"./useIsomorphicLayoutEffect-CxciEqLm.js";import"./ExpandMore-CE-AlmPZ.js";import"./AccordionDetails-CKE4MG-J.js";import"./index-DnL3XN75.js";import"./Collapse-DuUvJIAd.js";import"./useAsync-DwtigoPq.js";import"./useMountedState-UCRwgIDM.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BgCJnSoO.js";import"./ErrorBoundary-F_hBtf1o.js";import"./ErrorPanel-CDFCJhtV.js";import"./WarningPanel-CfgTJdNP.js";import"./MarkdownContent-CQVlpVaR.js";import"./CodeSnippet-BRYqmlwq.js";import"./Box-DKI1NtYF.js";import"./styled-BZchgpfg.js";import"./CopyTextButton-CfcOHHdO.js";import"./useCopyToClipboard-CrQaQuzV.js";import"./Tooltip-rFR9MD6z.js";import"./Popper-BQ20DEXn.js";import"./List-D4oyelOm.js";import"./ListContext-D23aAr-N.js";import"./ListItem-DGmfxxZu.js";import"./ListItemText-CIKs-KSS.js";import"./LinkButton-DxVeoCL2.js";import"./Link-D0uGQ-EQ.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BB7CXK1i.js";import"./Divider-4xHmk1Qy.js";import"./CardActions-BOmf1H7g.js";import"./BottomLink-DMese3Ls.js";import"./ArrowForward-Dcuc9hR9.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
