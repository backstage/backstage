import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-CIdfBUNc.js";import{s as g,H as u}from"./plugin-DYWiNART.js";import{c as h}from"./api-BjmP88h0.js";import{c as f}from"./catalogApiMock-SdvGNYzM.js";import{s as x}from"./api-DPo6etgd.js";import{S as y}from"./SearchContext-Chra9qDZ.js";import{P as S}from"./Page-BP3Phra1.js";import{S as r}from"./Grid-CNMGd53o.js";import{b as k,a as j,c as C}from"./plugin-Ce5LEohf.js";import{T as P}from"./TemplateBackstageLogo-DkVbWhZu.js";import{T}from"./TemplateBackstageLogoIcon-CtnTgfDK.js";import{e as I}from"./routes-glrX_FjV.js";import{w as v}from"./appWrappers-AgrnuiEj.js";import{s as G}from"./StarredEntitiesApi-DWkK6j6N.js";import{M as A}from"./MockStarredEntitiesApi-fJ6WkRvx.js";import{I as B}from"./InfoCard-JJieDDHR.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D6HVU49s.js";import"./Plugin-Cal27Rxh.js";import"./componentData-CJ11DeEU.js";import"./useAnalytics-DK0dZYSI.js";import"./useApp-DNuP2PYf.js";import"./useRouteRef-BtzOE2h6.js";import"./index-6Q4r393t.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-Cop8mLj-.js";import"./useMountedState-CxwBQu50.js";import"./DialogTitle-D9_Z1_7w.js";import"./Modal-BoVNQ_gf.js";import"./Portal-CzMBs-js.js";import"./Backdrop-CX0eMuCq.js";import"./Button-Ckh3f-JS.js";import"./useObservable-DS2HW8Ao.js";import"./useIsomorphicLayoutEffect-BNA5FOYt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DkWk2PaR.js";import"./ErrorBoundary-5twXAJLu.js";import"./ErrorPanel-BxCVrdam.js";import"./WarningPanel-CssXi-zs.js";import"./ExpandMore-CVq5yZzR.js";import"./AccordionDetails-Db8RrwKQ.js";import"./index-B9sM2jn7.js";import"./Collapse-C667vUQ9.js";import"./MarkdownContent-DeGRTh9e.js";import"./CodeSnippet-yQ1UvqA7.js";import"./Box-2FUA-1uv.js";import"./styled-D6NhFGBl.js";import"./CopyTextButton-B2Os4u3r.js";import"./useCopyToClipboard-C5xquscJ.js";import"./Tooltip-CiUyWjSw.js";import"./Popper-zpN6QrBD.js";import"./List-CWTfe060.js";import"./ListContext-BIMkaxMd.js";import"./ListItem-Dfr179My.js";import"./ListItemText-CPW3cjiy.js";import"./LinkButton-DENdbCNl.js";import"./Link-BiOJGlt4.js";import"./CardHeader-CYD6avdX.js";import"./Divider-DSMvF0Rh.js";import"./CardActions-DAFfhJ8c.js";import"./BottomLink-Wb3zLKXo.js";import"./ArrowForward-DWvoUq3l.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
