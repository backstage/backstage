import{j as t,W as u,m as p,K as g,X as h}from"./iframe-gtROSIwU.js";import{r as x}from"./plugin-CG62MHu5.js";import{S as l,u as c,a as S}from"./useSearchModal-DJiQpDa5.js";import{s as M,M as C}from"./api-_5ugvYUm.js";import{S as f}from"./SearchContext-C0ZgRz3i.js";import{B as m}from"./Button-BLGMliOb.js";import{D as j,a as y,b as B}from"./DialogTitle-B6aqdjGW.js";import{B as D}from"./Box-DVyEyde4.js";import{S as n}from"./Grid-Dk9zonhM.js";import{S as I}from"./SearchType-CfyQGmZV.js";import{L as G}from"./List-4z_Kf1-d.js";import{H as R}from"./DefaultResultListItem-Ca_ppeqX.js";import{w as k}from"./appWrappers-DEYSUYiA.js";import{SearchBar as v}from"./SearchBar-BoWlMORd.js";import{S as T}from"./SearchResult-7NbD_lQG.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dp73BRoY.js";import"./Plugin-BpSip1fn.js";import"./componentData-BJhcMQQA.js";import"./useAnalytics-CleNnKnR.js";import"./useApp-E5OH6s9s.js";import"./useRouteRef-BrgfpYLF.js";import"./index-C21dWa9i.js";import"./ArrowForward-WAHWfl-w.js";import"./translation-BHk_AcJt.js";import"./Page-CeLI_eWX.js";import"./useMediaQuery-BMA_Vj61.js";import"./Divider-B608YcMs.js";import"./ArrowBackIos-wz2fzKGV.js";import"./ArrowForwardIos-BzDx8ru8.js";import"./translation-CWCNaR7u.js";import"./lodash-BVz7JNon.js";import"./useAsync-hSbEIIiT.js";import"./useMountedState-D4qBcejv.js";import"./Modal-ybKC94PT.js";import"./Portal-DfJk_0nC.js";import"./Backdrop-D-cveIOx.js";import"./styled-Bs_QlAid.js";import"./ExpandMore-Dy0QGkdX.js";import"./AccordionDetails-D-QssX3g.js";import"./index-B9sM2jn7.js";import"./Collapse-CUtCvRoB.js";import"./ListItem-CchOfbIa.js";import"./ListContext-DPykjs2z.js";import"./ListItemIcon-DreOmVJE.js";import"./ListItemText-DPWCpjxc.js";import"./Tabs-O8lXShqe.js";import"./KeyboardArrowRight-DY3LZkoV.js";import"./FormLabel-D5IhyyIv.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CmvdfJNM.js";import"./InputLabel-CSNsM7jZ.js";import"./Select-CLgD42SM.js";import"./Popover-C_iP5aYt.js";import"./MenuItem-FPFAt3cA.js";import"./Checkbox-JTtLJ8x-.js";import"./SwitchBase-BUQXY-F2.js";import"./Chip-BoM1fEJT.js";import"./Link-ISGpl10u.js";import"./useObservable-DQRGEcr0.js";import"./useIsomorphicLayoutEffect-DNxXff-b.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-ByyGSHUv.js";import"./useDebounce-B2FdXvTG.js";import"./InputAdornment-DOHt7p5g.js";import"./TextField-BW7xijOF.js";import"./useElementFilter-B2kUAJlM.js";import"./EmptyState-BQ5xs3q9.js";import"./Progress-D7LOFa83.js";import"./LinearProgress-BTVYJvHe.js";import"./ResponseErrorPanel-B82p5L_Y.js";import"./ErrorPanel-DBlUZWIE.js";import"./WarningPanel-xN1aOkvL.js";import"./MarkdownContent-Dlgl5pdq.js";import"./CodeSnippet-BGAs7RWs.js";import"./CopyTextButton-Ctc6sP1v.js";import"./useCopyToClipboard-BlctA6j9.js";import"./Tooltip-C-NpfkzH.js";import"./Popper-DSlAm5T6.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
