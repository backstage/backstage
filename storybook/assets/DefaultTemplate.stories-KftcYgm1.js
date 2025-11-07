import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BpYUhtQT.js";import{s as g,H as u}from"./plugin-BBIbsTCY.js";import{c as h}from"./api-AYinOtzd.js";import{c as f}from"./catalogApiMock-OVkx0OA7.js";import{s as x}from"./api-CGdsmrDM.js";import{S as y}from"./SearchContext-Qa-NpMIX.js";import{P as S}from"./Page-BKrpd-OI.js";import{S as r}from"./Grid-BSBIJVeD.js";import{b as k,a as j,c as C}from"./plugin-CvKOWj6E.js";import{T as P}from"./TemplateBackstageLogo-BZdrP-PH.js";import{T}from"./TemplateBackstageLogoIcon-2QqXycIg.js";import{e as I}from"./routes-CFxPnSi1.js";import{w as v}from"./appWrappers-peGXwDQa.js";import{s as G}from"./StarredEntitiesApi-PKBQ39Ld.js";import{M as A}from"./MockStarredEntitiesApi-DG7qrkME.js";import{I as B}from"./InfoCard-BU1H8Nsz.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Oo4mrAWG.js";import"./Plugin-DowXY3sc.js";import"./componentData-BaoDxexO.js";import"./useAnalytics-Bh2pk9PK.js";import"./useApp-DvIsmpbF.js";import"./useRouteRef-l3dtiGOV.js";import"./index-Ce36-Nje.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-BpYeyvGz.js";import"./useMountedState-DBGgrpWA.js";import"./DialogTitle-CB5Y5dHf.js";import"./Modal-0XcuTVfd.js";import"./Portal-OHyZAVgE.js";import"./Backdrop-RvGqs8Vm.js";import"./Button-BY1Og1vF.js";import"./useObservable-3jB7UW4m.js";import"./useIsomorphicLayoutEffect-1EIRTIdR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BIK6qFXi.js";import"./ErrorBoundary-DzqamQ5F.js";import"./ErrorPanel-DX0kqAsP.js";import"./WarningPanel-8zkHCnj8.js";import"./ExpandMore-CeSJ010X.js";import"./AccordionDetails-fjjprATf.js";import"./index-DnL3XN75.js";import"./Collapse-CmnpFYn4.js";import"./MarkdownContent-BWS4BjxZ.js";import"./CodeSnippet-C2KdpqrO.js";import"./Box-DFzIAW_k.js";import"./styled-CvmEiBn0.js";import"./CopyTextButton-DC1eYg7O.js";import"./useCopyToClipboard-shAo73Yc.js";import"./Tooltip-CKt0VlQr.js";import"./Popper-mZ76pVB3.js";import"./List-CSZ53dK9.js";import"./ListContext-MOdDfATV.js";import"./ListItem-DoWEcNrm.js";import"./ListItemText-CJKnCLsZ.js";import"./LinkButton-PBhijShz.js";import"./Link-CMqafiV1.js";import"./CardHeader-arrMMvmZ.js";import"./Divider-C5hfIyuI.js";import"./CardActions-CtZbu5K_.js";import"./BottomLink-DlULM6Ak.js";import"./ArrowForward-BIypQajv.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
