import{j as t,Z as u,N as p,$ as g}from"./iframe-DhudO7cT.js";import{r as h}from"./plugin-D_Om1NU6.js";import{S as l,u as c,a as x}from"./useSearchModal-CWroPSmH.js";import{s as S,M}from"./api-rLiZlmmd.js";import{S as C}from"./SearchContext-Ci6cvaR5.js";import{B as m}from"./Button-CgvS3Q_x.js";import{m as f}from"./makeStyles-DirKP-uM.js";import{D as j,a as y,b as B}from"./DialogTitle-Dg6YRpBj.js";import{B as D}from"./Box-Dfq4Rk_q.js";import{S as n}from"./Grid-jH0iynLg.js";import{S as I}from"./SearchType-B_N-Xnm5.js";import{L as G}from"./List-CETIUmeh.js";import{H as R}from"./DefaultResultListItem-BsIZ_q0i.js";import{w as k}from"./appWrappers-BORPb0rG.js";import{SearchBar as v}from"./SearchBar-qPUu7r-R.js";import{S as T}from"./SearchResult-CcZXe-zV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-rc4ILUAE.js";import"./Plugin-BlGkq011.js";import"./componentData-ISH3JKjp.js";import"./useAnalytics-CJ0Sk0Lg.js";import"./useApp-rE8BYLs2.js";import"./useRouteRef-OVdEYZHs.js";import"./index-CBf-CADU.js";import"./ArrowForward-Dv_ycIrF.js";import"./translation-zkjNy0g3.js";import"./Page-DUZYRgQc.js";import"./useMediaQuery-DxDp67PO.js";import"./Divider-RGA0wFT4.js";import"./ArrowBackIos-BpxmQsdc.js";import"./ArrowForwardIos-CqepBnAY.js";import"./translation-sDvm6KWz.js";import"./lodash-D50Mv8ds.js";import"./useAsync-CTFC4gS_.js";import"./useMountedState-Cnm9VAPO.js";import"./Modal-D-bP3iV-.js";import"./Portal-DHDPWTL1.js";import"./Backdrop-DPs0Yty2.js";import"./styled-Bb0qtC6P.js";import"./ExpandMore-Dzyb0v5N.js";import"./AccordionDetails-DA1Ac_9j.js";import"./index-B9sM2jn7.js";import"./Collapse-Si3YYgpF.js";import"./ListItem--o6-pCQj.js";import"./ListContext-DXxn2Iso.js";import"./ListItemIcon-B92s_sX7.js";import"./ListItemText-BSb4Izlr.js";import"./Tabs-Bac8NjfU.js";import"./KeyboardArrowRight-BmEx88-C.js";import"./FormLabel-BunYcRsf.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BjKsPsRM.js";import"./InputLabel-BzpyGJFz.js";import"./Select-SVF-WZGg.js";import"./Popover-Co_U8rXS.js";import"./MenuItem-D36xk1oN.js";import"./Checkbox-Bwz0Bue4.js";import"./SwitchBase-BE2UYCnQ.js";import"./Chip-DWqAK_m6.js";import"./Link-CqfoUZfB.js";import"./index-T8FjcnlS.js";import"./useObservable-CD0inowd.js";import"./useIsomorphicLayoutEffect-BNtsuMGe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-SBquM9Sa.js";import"./useDebounce-DSy40S6p.js";import"./InputAdornment-BKc2BRc-.js";import"./TextField-DChCEKf2.js";import"./useElementFilter-C6eRi6jb.js";import"./EmptyState-CJgr6CxE.js";import"./Progress-ztlXokXb.js";import"./LinearProgress-CNN-yJxU.js";import"./ResponseErrorPanel-jTgGw--z.js";import"./ErrorPanel-BEeSwh_R.js";import"./WarningPanel-DWteI-lj.js";import"./MarkdownContent-BGd3KqzE.js";import"./CodeSnippet-jJNwy4RK.js";import"./CopyTextButton-j222rm7k.js";import"./useCopyToClipboard-DhzHiaOU.js";import"./Tooltip-DGvAz1hB.js";import"./Popper-ByURgkss.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
