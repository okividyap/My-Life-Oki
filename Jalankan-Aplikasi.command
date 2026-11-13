#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
echo "=========================================================="
echo "  MY LIFE - Personal Life Management System (WITA)"
echo "  Membuka aplikasi web di browser default Anda..."
echo "=========================================================="
open "$DIR/index.html"
exit 0
