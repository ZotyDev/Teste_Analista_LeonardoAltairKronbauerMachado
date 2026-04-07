{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs
          pnpm
          sqls
          postgresql

          # LSPs
          typescript-language-server
          vscode-langservers-extracted
        ];

        shellHook = ''
          export PATH="$PWD/dashboard/node_modules/.bin:$PATH"
        '';
      };
    };
}
