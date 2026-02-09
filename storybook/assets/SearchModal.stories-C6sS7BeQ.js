import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-CafSZihE.js";import{r as x}from"./plugin-0p0A1CsQ.js";import{S as l,u as c,a as S}from"./useSearchModal-B0IscQq8.js";import{s as M,M as C}from"./api-CbY9Wnw2.js";import{S as f}from"./SearchContext-Bt-ALBEg.js";import{B as m}from"./Button-DR_OBMXZ.js";import{D as j,a as y,b as B}from"./DialogTitle-BOLKbyFf.js";import{B as D}from"./Box-fRbsHjDs.js";import{S as n}from"./Grid-CE8ncWjM.js";import{S as I}from"./SearchType-DN7Q9Iu4.js";import{L as G}from"./List-B4E6UX55.js";import{H as R}from"./DefaultResultListItem-ox63UXbY.js";import{w as k}from"./appWrappers-Bm81Y_Ag.js";import{SearchBar as v}from"./SearchBar-haYETAJ0.js";import{S as T}from"./SearchResult-ipWcukVJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BtwrDnXc.js";import"./Plugin-CmWRPz1q.js";import"./componentData-BMaKz9VF.js";import"./useAnalytics-CkIdISEJ.js";import"./useApp-BWekrYpt.js";import"./useRouteRef-Bk50-K9_.js";import"./index-CWZByKrh.js";import"./ArrowForward-B_DalRq-.js";import"./translation-uTxDUne1.js";import"./Page-BsA9DZk6.js";import"./useMediaQuery-BV59hSOR.js";import"./Divider-C4EwzhjR.js";import"./ArrowBackIos-DuJUdFll.js";import"./ArrowForwardIos-C9DA8-5a.js";import"./translation-BECPSRXV.js";import"./lodash-Czox7iJy.js";import"./useAsync-CWT4UngH.js";import"./useMountedState-Bx1mDZHi.js";import"./Modal-119bZl-Y.js";import"./Portal-W2FhbA1a.js";import"./Backdrop-CN6b5uOg.js";import"./styled-XhcyHdDa.js";import"./ExpandMore-B67diL7X.js";import"./AccordionDetails-CZxQwlea.js";import"./index-B9sM2jn7.js";import"./Collapse-uTAZOzA3.js";import"./ListItem-DVuo4x9u.js";import"./ListContext-CWAV-zjc.js";import"./ListItemIcon-BJeC8YGJ.js";import"./ListItemText-B-CF-Ijo.js";import"./Tabs-DWqyhAjz.js";import"./KeyboardArrowRight-Be-5JOUF.js";import"./FormLabel-Cuu-1rVO.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B0aWi8nB.js";import"./InputLabel-BvddD8r0.js";import"./Select-BiIECLtT.js";import"./Popover-DWlOw0Ay.js";import"./MenuItem-B7mvpdUP.js";import"./Checkbox-8H2tDljy.js";import"./SwitchBase-0NNKCj3q.js";import"./Chip-CKSdfYsG.js";import"./Link-DyiL97g3.js";import"./useObservable-C7I0Kmlp.js";import"./useIsomorphicLayoutEffect-rUIA2I1q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B3SIh3Lh.js";import"./useDebounce-B67C5Y4_.js";import"./InputAdornment-Cyx3H-Sq.js";import"./TextField-CoRqCMh5.js";import"./useElementFilter-CkBsScX_.js";import"./EmptyState-Bjupis0b.js";import"./Progress-CQlT9jB8.js";import"./LinearProgress-_9kW1NgK.js";import"./ResponseErrorPanel-Cnh5_8Eq.js";import"./ErrorPanel-Cbj0fdBm.js";import"./WarningPanel-BCt9Bv9g.js";import"./MarkdownContent-C9IhCAop.js";import"./CodeSnippet-BTTGQVt6.js";import"./CopyTextButton-Xa9XWeEV.js";import"./useCopyToClipboard-C5jlCbNf.js";import"./Tooltip-CWOPvmrv.js";import"./Popper-DcG5vPGv.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
