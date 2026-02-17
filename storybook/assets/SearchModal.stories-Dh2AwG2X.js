import{j as t,W as u,K as p,X as g}from"./iframe-BCnUaApn.js";import{r as h}from"./plugin-DWHw_eVu.js";import{S as l,u as c,a as x}from"./useSearchModal-CF7II0sP.js";import{s as S,M}from"./api-DGJrcS-c.js";import{S as C}from"./SearchContext-ItWN41u7.js";import{B as m}from"./Button-CnhmJZnK.js";import{m as f}from"./makeStyles-JxVjC-J_.js";import{D as j,a as y,b as B}from"./DialogTitle-dUe6ux1J.js";import{B as D}from"./Box-Cd17mACv.js";import{S as n}from"./Grid-C3uFc5ER.js";import{S as I}from"./SearchType-D9jXTPT6.js";import{L as G}from"./List-CQ8sfUf8.js";import{H as R}from"./DefaultResultListItem-DUG8TqDd.js";import{w as k}from"./appWrappers-qntyPjQu.js";import{SearchBar as v}from"./SearchBar-BtQNgNvO.js";import{S as T}from"./SearchResult-CcNRQ653.js";import"./preload-helper-PPVm8Dsz.js";import"./index-cc1Wp48y.js";import"./Plugin-fif-fbA6.js";import"./componentData-CVazM3rv.js";import"./useAnalytics-C8tUzO32.js";import"./useApp-Dfh5cMly.js";import"./useRouteRef-Db9N74R7.js";import"./index-B-tXUl4g.js";import"./ArrowForward-Bb1IsA78.js";import"./translation-9GpW2RMw.js";import"./Page-DeUn_uGf.js";import"./useMediaQuery-B9j3IPMx.js";import"./Divider-Bh_4Dh-e.js";import"./ArrowBackIos-D3Mh_oGD.js";import"./ArrowForwardIos-anUMx1hX.js";import"./translation-B_glP5SV.js";import"./lodash-DBetALU0.js";import"./useAsync-D_PXZuIc.js";import"./useMountedState-vrTKrSWN.js";import"./Modal-DttNqa2Q.js";import"./Portal-CNnOrQPJ.js";import"./Backdrop-u-ccDXcz.js";import"./styled-CI-jgXD3.js";import"./ExpandMore-BUxi-bqu.js";import"./AccordionDetails-BN4iSEgA.js";import"./index-B9sM2jn7.js";import"./Collapse-CEOYVyzq.js";import"./ListItem-BwmhHob9.js";import"./ListContext-0sSsVP2_.js";import"./ListItemIcon-TwsYfTjW.js";import"./ListItemText-DVlnZYcM.js";import"./Tabs-DKssiqmE.js";import"./KeyboardArrowRight-CDV3ebRj.js";import"./FormLabel-CcK6Kum8.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-KKs53F56.js";import"./InputLabel-JuQ62ob_.js";import"./Select-Hy1AZ8c8.js";import"./Popover-Bu1QA2KL.js";import"./MenuItem-DyjFW4LQ.js";import"./Checkbox-CuWAVtpt.js";import"./SwitchBase-DTUTTZEN.js";import"./Chip-BvmNOzN_.js";import"./Link-DmstRdCS.js";import"./index-D7kONAGS.js";import"./useObservable-CcrhNd8c.js";import"./useIsomorphicLayoutEffect-XGf8PK8W.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CNVKfNXg.js";import"./useDebounce-CaZOQf6k.js";import"./InputAdornment-poVG5Fye.js";import"./TextField-BSshh-uL.js";import"./useElementFilter-fuKYFD4F.js";import"./EmptyState-CWSLhhUq.js";import"./Progress-C5027892.js";import"./LinearProgress-BYBu9bVV.js";import"./ResponseErrorPanel-CW_24010.js";import"./ErrorPanel-x_jMiiwi.js";import"./WarningPanel-CdZprqUb.js";import"./MarkdownContent-CPQSEOMY.js";import"./CodeSnippet-w7LWt9O1.js";import"./CopyTextButton-DQ06hCcl.js";import"./useCopyToClipboard-UsWsD_q0.js";import"./Tooltip-_2auSyxn.js";import"./Popper-yUMq0QBb.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
