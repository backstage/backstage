import{j as o}from"./iframe-DZkam7Bj.js";import{c as e}from"./plugin-D6dEO2vP.js";import{S as l}from"./Grid-DBMZs7np.js";import{C as m}from"./ComponentAccordion-Cd4sXVh-.js";import{w as a}from"./appWrappers-Bg6ecWLG.js";import{T as i}from"./TemplateBackstageLogoIcon-C38sXuD6.js";import{I as s}from"./InfoCard-DESjlp5V.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D0wcgIxz.js";import"./componentData-D2mgrz7C.js";import"./useAnalytics-RqWf-jVc.js";import"./useApp-CAfcC71X.js";import"./useRouteRef-BbGjzdGG.js";import"./index-BYedHEZ0.js";import"./DialogTitle-BODx1QEM.js";import"./Modal-Dli2H9pG.js";import"./Portal-mqL5KVNN.js";import"./Backdrop-970MLPke.js";import"./Button-C84XLh64.js";import"./useObservable-CEhyWTyT.js";import"./useIsomorphicLayoutEffect-DFCzL8zZ.js";import"./ExpandMore-B142-YHG.js";import"./AccordionDetails-4Wsid_gA.js";import"./index-B9sM2jn7.js";import"./Collapse-CyMpxX-e.js";import"./useAsync-BRCkrjty.js";import"./useMountedState-ChfRzppL.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-m46vxV1w.js";import"./ErrorBoundary-UF8MZD5v.js";import"./ErrorPanel-DvnF6D1Z.js";import"./WarningPanel-W5ZE-W22.js";import"./MarkdownContent-0F8rqmt_.js";import"./CodeSnippet-BFE5NLd5.js";import"./Box-DChwE7Ki.js";import"./styled-RI4GT_4U.js";import"./CopyTextButton-Bji7cX2P.js";import"./useCopyToClipboard-DSpaqeDH.js";import"./Tooltip-D0UPjqYE.js";import"./Popper-CT_phagK.js";import"./List-Ca4J4jzY.js";import"./ListContext-D7S-zqsj.js";import"./ListItem-DNrM1AYn.js";import"./ListItemText-CiywuPc3.js";import"./LinkButton-DWub5hGG.js";import"./Link-BoLwiIPW.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-CDP-7wiu.js";import"./Divider-CrMgh5SC.js";import"./CardActions-DiMkl16p.js";import"./BottomLink-DmPOneGd.js";import"./ArrowForward-DJhLoZFc.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
